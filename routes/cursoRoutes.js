const {Router} = require("express")
const router = Router();
const {crearCurso, obtenerCursoPorId, obtenerTodosLosCursos} = require("../controllers/cursoControllers");

router.route("/buscarCurso/:id")
.get(obtenerCursoPorId)

router.route("/buscarCursos")
.get(obtenerTodosLosCursos)

router.route('/crearCurso')
.post(crearCurso)

module.exports =  router;