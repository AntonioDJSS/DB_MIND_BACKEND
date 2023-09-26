const { Router } = require("express")
const { crearProyecto,
        mostrarProyectos,
        actualizarProyectos,
        borrarProyectos,
        misProyectos,
        actualizarProyecto,
        borrarProyecto } = require('../controllers/proyectoController')

const { protect } = require('../middlewares/auth-validar');
const { esRoleValido } = require ('../helpers/db-validators');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();


//RUTAS PARA TODOS
router.post('/',[
    protect,
    // tieneRole('ADMIN_ROLE', 'USER_ROLE'),
], crearProyecto )

//USER
router.get('/misProyectos',[
    protect,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
], misProyectos)

router.put('/actualizarProyecto/:id',[
    protect,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
], actualizarProyecto )

router.delete('/borrarProyecto/:id',[
    protect,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
],borrarProyecto)

//ADMIN
router.get('',[
    protect,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    esAdminRole,
] ,mostrarProyectos )

router.put('/:id',[
    //protect,
    //tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    //esAdminRole,
], actualizarProyectos )

router.delete('/:id',[
    //protect,
    //tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    //esAdminRole
], borrarProyectos )



module.exports =  router;