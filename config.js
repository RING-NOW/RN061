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
  */
  estructura: {
    pisos:         0,
    deptosPorPiso: 0,
    deptosManual:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
