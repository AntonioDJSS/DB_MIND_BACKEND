const {Router} = require("express")
const router = Router();
const  {crearRespuesta, obtenerRespuestasPorUsuario, obtenerRespuestas} = require('../controllers/respuestaController')
const { protect } = require("../middlewares/auth-validar");

router.route('/crearRespuesta')
.post(protect ,crearRespuesta )

router.route('/obtenerCalificaciones')
.get(protect, obtenerRespuestasPorUsuario)

router.route('/obtenerAllCalificaciones')
.get( obtenerRespuestas)

module.exports =  router;