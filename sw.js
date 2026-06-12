// Service Worker — RINGNOW Portero Digital v2
// Lee la config del edificio desde Cache API

let watchInterval = null;
let lastCallId = null;
let myDepto = null;
let firebaseDB = null;
let baseURL = null;

self.addEventListener('install', function(e) { self.skipWaiting(); });

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim().then(function() { return arrancar(); }));
});

// Recibir depto y config desde la página
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'WATCH_DEPTO') {
    myDepto = event.data.depto;
    guardarConfig({ depto: myDepto, firebaseDB: event.data.firebaseDB, baseURL: event.data.baseURL });
    iniciarPolling();
  }
});

function guardarConfig(cfg) {
  return caches.open('ringnow-v2').then(function(cache) {
    return cache.put('/portero-config', new Response(JSON.stringify(cfg)));
  });
}

function leerConfig() {
  return caches.open('ringnow-v2').then(function(cache) {
    return cache.match('/portero-config').then(function(resp) {
      if (resp) return resp.json();
      return null;
    });
  });
}

function arrancar() {
  return leerConfig().then(function(cfg) {
    if (cfg && cfg.depto) {
      myDepto = cfg.depto;
      firebaseDB = cfg.firebaseDB;
      baseURL = cfg.baseURL;
      iniciarPolling();
    }
  });
}

function iniciarPolling() {
  if (watchInterval) clearInterval(watchInterval);
  if (!myDepto || !firebaseDB) return;
  checkForCalls();
  watchInterval = setInterval(checkForCalls, 2000);
}

function checkForCalls() {
  if (!myDepto || !firebaseDB) {
    leerConfig().then(function(cfg) {
      if (cfg) { myDepto = cfg.depto; firebaseDB = cfg.firebaseDB; baseURL = cfg.baseURL; iniciarPolling(); }
    });
    return;
  }

  var deptoVal = isNaN(myDepto) ? '"' + myDepto + '"' : myDepto;
  fetch(firebaseDB + '/calls.json?orderBy="deptoId"&equalTo=' + deptoVal + '&limitToLast=3')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || typeof data !== 'object') return;
      var ahora = Date.now();
      Object.keys(data).forEach(function(callId) {
        var call = data[callId];
        if (!call || call.status !== 'ringing') return;
        if (callId === lastCallId) return;
        if (ahora - (call.timestamp || 0) > 35000) return;
        lastCallId = callId;
        mostrarNotificacion(myDepto, callId);
      });
    })
    .catch(function() {});
}

function mostrarNotificacion(depto, callId) {
  var url = (baseURL || '') + '/timbre-residente.html?depto=' + depto + '&callId=' + callId;
  self.registration.showNotification('Llamada — Depto ' + depto, {
    body: 'Tocaron el timbre',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    tag: 'llamada',
    renotify: true,
    data: { depto: depto, callId: callId, url: url },
    actions: [
      { action: 'atender', title: 'Atender' },
      { action: 'rechazar', title: 'Rechazar' }
    ]
  });
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var data = event.notification.data || {};
  var depto = data.depto;
  var callId = data.callId;
  var url = data.url;

  if (event.action === 'rechazar') {
    if (firebaseDB && callId) {
      fetch(firebaseDB + '/calls/' + callId + '/status.json', {
        method: 'PUT', body: JSON.stringify('rejected')
      }).catch(function() {});
    }
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes('timbre-residente') && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
