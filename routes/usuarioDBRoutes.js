const {Router} = require("express")
const router = Router();

const {obtenerUsuarios} = require('../controllers/usuariosDBController')

router.route("/buscarUsuarios")
.get(obtenerUsuarios)

module.exports = router;