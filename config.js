/* =============================================================
   RINGNOW — Configuración del edificio
   Editá solo este archivo para adaptar el sistema a un nuevo edificio.
   ============================================================= */

const RINGNOW_CONFIG = {

  /* ── Datos del edificio ── */
  edificio: {
    nombre:     "Blanco Encalada 3225",
    slug:       "RN061",
    githubUser: "RING-NOW",
  },

  /* ── Estructura de departamentos ──
     Modo manual: listado exacto de timbres en orden
     0 = Planta Baja / Encargado
  */
  estructura: {
    pisos:         0,
    deptosPorPiso: 0,
    deptosManual:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },

  /* ── Canales ntfy fijos por depto ──
     Se generan una sola vez por edificio. No hace falta tocarlos.
  */
  canalesNtfy: {
    0:  "rn-rn061-d0-qi3xl5",
    1:  "rn-rn061-d1-1visbi",
    2:  "rn-rn061-d2-5qruy4",
    3:  "rn-rn061-d3-vetoq2",
    4:  "rn-rn061-d4-pjyrq0",
    5:  "rn-rn061-d5-1dbteo",
    6:  "rn-rn061-d6-zmwa3z",
    7:  "rn-rn061-d7-wwgg3u",
    8:  "rn-rn061-d8-90iwwi",
    9:  "rn-rn061-d9-k86exc",
    10: "rn-rn061-d10-p8adoo",
    11: "rn-rn061-d11-m40e3s",
    12: "rn-rn061-d12-704yhs",
  },

  /* ── Firebase ── */
  firebase: {
    apiKey:            "AIzaSyDO3kfFwTMD2ICyJV5_YgMFUx98_sOVl0g",
    authDomain:        "rn063-ab4ec.firebaseapp.com",
    databaseURL:       "https://rn063-ab4ec-default-rtdb.firebaseio.com",
    projectId:         "rn063-ab4ec",
    storageBucket:     "rn063-ab4ec.firebasestorage.app",
    messagingSenderId: "3354332296",
    appId:             "1:3354332296:web:ef209dd369039d1866633d"
  },

};

/* ── Helpers derivados (no tocar) ── */
RINGNOW_CONFIG.deptos = (function() {
  const e = RINGNOW_CONFIG.estructura;
  if (e.pisos > 0 && e.deptosPorPiso > 0) {
    const lista = [];
    for (let p = 1; p <= e.pisos; p++) {
      for (let u = 1; u <= e.deptosPorPiso; u++) {
        lista.push(p * 100 + u);
      }
    }
    return lista;
  }
  return e.deptosManual;
})();

RINGNOW_CONFIG.baseURL = (function() {
  const { githubUser, slug } = RINGNOW_CONFIG.edificio;
  return 'https://' + githubUser + '.github.io/' + slug;
})();
