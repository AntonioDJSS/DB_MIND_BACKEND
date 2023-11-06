const {Router} = require("express")
const router = Router();
const {crearEvaluacion, obtenerEvaluaciones, getEvalucionById} = require("../controllers/evaluacionController");

router.route('/crearEvaluacion')
.post(crearEvaluacion)

router.route("/ObtenerEvaluaciones")
.get(obtenerEvaluaciones)

router.route("/ObtenerEvaluacion/:id")
.get(getEvalucionById)

module.exports =  router;