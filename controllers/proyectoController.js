const ResponseError = require('../utils/ResponseError')
const Proyecto = require('../models/proyecto');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario')



const crearProyecto = async (req, res) => {

  let usuarioExiste = null;

  const { idt, nombre, descripcion, empresa, fechainicio, fechafin, estado } = req.body;
  const usuario = req.usuario;
  console.log(usuario)

  if (!usuario) {
    // Manejo de error cuando no se encuentra el usuario
    const response = new ResponseError(
      'fail',
      'El usuario no existe en la ruta',
      'El usuario no fue encontrado en la request',
    []).responseApiError();

    return res.status(404).json(
      response
    )

  }

    // Verificar que los campos requeridos estén presentes en la solicitud
    if (!nombre) {
      // Manejo de error cuando faltan campos obligatorios
    const response = new ResponseError(
      'fail',
      'Faltan campo de nombre en la solicitud',
      'Ingresa porfavor el campos de nombre en la solicitud',
      []).responseApiError();

    return res.status(400).json(
      response
    )
    }

    if (!descripcion ) {
    const response = new ResponseError(
      'fail',
      'Falta el campo de descripcion en la solicitud',
      'Ingresa porfavor el campos de descripcion en la solicitud',
      []).responseApiError();

    return res.status(400).json(
      response
    )
    }

    if (!empresa) {
    const response = new ResponseError(
      'fail',
      'Falta el campo de empresa en la solicitud',
      'Ingresa porfavor el campos de empresa en la solicitud',
      []).responseApiError();

    return res.status(400).json(
      response
    )
    }

    if (!fechainicio) {
      const response = new ResponseError(
        'fail',
        'Faltan campo de fechainicio en la solicitud',
        'Ingresa porfavor el campos de fechainicio en la solicitud',
        []).responseApiError();
  
      return res.status(400).json(
        response
      )
    }

    if (!fechafin) {
      const response = new ResponseError(
        'fail',
        'Faltan campo de fechafin en la solicitud',
        'Ingresa porfavor el campos de fechafin en la solicitud',
        []).responseApiError();
  
      return res.status(400).json(
        response
      )
    }
    console.log(estado)
    if (!estado) {
      const response = new ResponseError(
        'fail',
        'Faltan campo de estado en la solicitud',
        'Ingresa porfavor el estado de nombre en la solicitud',
        []).responseApiError();
  
      return res.status(400).json(
        response
      )
    }

    try {
      usuarioExiste = await Usuario.findById(usuario.id);
    } catch (ex) {
      const response = new ResponseError(
        'fail',
        'Error al realizar la consulta en la Base de Datos',
        ex.message,
      []).responseApiError();
    
      res.status(404).json(
        response
      )
    }
      

      if (!usuarioExiste) {
          // Manejo de error cuando el usuario no existe en la base de datos
        const response = new ResponseError(
          'fail',
          'El usuario no existe en la BD',
          'Ingresa un usuario existente porfavor, ya que no se encuentra en la BD',
        []).responseApiError();

          return res.status(404).json(
            response
          );
      }

      if (!Array.isArray(idt)) {
        const response = new ResponseError(
          'fail',
          'Error no estas ingresando bien los Tramites',
          'El campo "idt" debe ser un arreglo, porfavor ingresa los datos.',
        []).responseApiError();
        
        return res.status(400).json(
          response
        );
}

      // Validar que idt sea un arreglo de IDs válidos de MongoDB
      const areValidObjectIds = idt.every(mongoose.isValidObjectId);
      if (!areValidObjectIds) {
        const response = new ResponseError(
          'fail',
          'Alguno de los Ids de tramite no es válido',
          'Error al Validor que el tramite sea ID de Mongo valido',
        []).responseApiError();

          return res.status(400).json(
            response
          );
      }

      // Crear el proyecto con los datos proporcionados
      const proyecto = new Proyecto({
        idt: idt.map(id => ({ id: new mongoose.Types.ObjectId(id) })),
          nombre,
          descripcion,
          empresa,
          fechainicio,
          fechafin,
          estado,
          usuario: usuario.id
      });

      try {

      await proyecto.save();

      res.status(200).json({
          status: 'success',
          data: proyecto,
          message: 'Proyecto Creado Correctamente'
      });
  } catch (ex) {
      const response = new ResponseError(
        'fail',
        'No se pudo crear el proyecto',
        ex.message,
      []).responseApiError;

      res.status(500).json(
        response
      )
  }
}


////////////////////USER///////////////////////////////////////
//GET  POR ID Y USUARIO DE LA REQ.
const misProyectos = async (req, res) =>{

  const usuario = req.usuario;
  const { id } =  req.query;

  if(!usuario){
    const response = new responseApiError(
      'fail',
      'Usuario no encontrado, no te encuentras logueado',
      'No estas logueado, porfavor logueate',
     []).responseApiError();

  return  res.status(404).json(
      response
    )
  }


if (id) {

  const miProyecto = await Proyecto.findOne({ _id: id, usuario: usuario.id });

  if (!miProyecto) {
    const response = new ResponseError(
      'fail',
      'No existen proyectos',
      'No cuentas con proyectos existentes, porfavor crea proyectos',
    []).responseApiError();

    return res.status(404).json(
      response
    )
  }

  res.status(200).json({
    status: 'sucessful',
    data: miProyecto,
    message: 'Proyectos Encontrados Correctamente'
  })
  
} else {
  const miProyecto = await Proyecto.find({usuario: usuario.id});

  if (!miProyecto) {
    const response = new ResponseError(
      'fail',
      'No existen proyectos',
      'No cuentas con proyectos existentes, porfavor crea proyectos',
    []).responseApiError();

    return res.status(404).json(
      response
    )
  }

  res.status(200).json({
    status: 'sucessful',
    data: miProyecto,
    message: 'Proyectos Encontrados Correctamente'
  })
}

  
  
  

 
  

  
}
//ACTUALIZAR MIS PROYECTOS
const actualizarProyecto = async (req, res) =>{
  const { id } = req.params;
  const nuevoProyecto = req.body;
  const usuario = req.usuario;

  //  console.log(usuario.id)

  if (!id) {
    const response = new ResponseError(
      'fail',
      'ID no ingresado',
      'Proporciona un id de un proyecto',
      []
    ).responseApiError();

    return res.status(500).json(response);
  }

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  let proyecto = await Proyecto.findOne({ _id: id });

  if (!proyecto) {
    const response = new ResponseError(
      'fail',
      'Proyecto no encontrado',
      'No hay ningún proyecto, por favor asigna un proyecto existente',
      []
    ).responseApiError();

    return res.status(404).json(response);
  }
  //  console.log(proyecto.usuario)
try {
  
    if (usuario.id == proyecto.usuario) {
      proyecto.set(nuevoProyecto); // Actualiza los campos con los valores del nuevoProyecto
    await proyecto.save();
    } else{
      const response = new ResponseError(
        'fail',
        'No puedes actualizar este proyecto, no cuentas con el permiso necesario',
        'No puedes actualizar el proyecto , porfavor actualiza uno de tus proyectos',
        []).responseApiError();
  
      return res.status(500).json(
        response
      )
    }

  res.status(200).json({
    status: 'successful',
    data: proyecto,
    message: 'Proyecto Actualizado Correctamente',
  });
} catch (ex) {
  const response = new ResponseError(
    'fail',
    'Hubo error al actualizar el proyecto',
    ex.message,
    []). responseApiError();

    res.status(500).json(
      response
    )
}

  
}
//ELIMINAR MIS PROYECTOS
const borrarProyecto = async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  // console.log(usuario.id)
  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  try {
    // Buscar el proyecto por su ID
    const proyectoEncontrado = await Proyecto.findOne({ _id: id });

    if (!proyectoEncontrado) {
      const response = new ResponseError(
        'fail',
        'Proyecto no encontrado',
        'El proyecto no se encuentra al realizar la búsqueda',
        []
      ).responseApiError();

      return res.status(404).json(response);
    }
    // console.log(proyectoEncontrado.usuario)

    if (usuario.id == proyectoEncontrado.usuario) {
      // Eliminar el proyecto encontrado
      await proyectoEncontrado.deleteOne(); // Utilizar deleteOne() en lugar de delete()
    } else {
      const response = new ResponseError(
        'fail',
        'No tienes el permiso para eliminar este proyecto',
        'No puedes eliminar este proyecto porque no cuentas con el permiso necesario',
        []
      ).responseApiError();
  
      return res.status(500).json(response);
    }

    res.status(200).json({
      status: 'successful',
      message: 'Proyecto eliminado correctamente',
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al eliminar el proyecto',
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};





///////////////////ADMIN////////////////////////////////
const mostrarProyectos = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  try {
    const totalProyectos = await Proyecto.countDocuments(); // Contar el total de proyectos en la base de datos
    const skip = (page - 1) * limit;
    const proyectos = await Proyecto.find().skip(skip).limit(Number(limit));

    res.status(200).json({
      status: 'successful',
      total: totalProyectos, // Agregar el total de proyectos al resultado
      data: proyectos,
      message: 'Proyectos Encontrados'
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al realizar la búsqueda en la BD',
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};
const actualizarProyectos = async (req, res) => {
  const { id } = req.params;
  const nuevoProyecto = req.body;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  try {
    let proyecto = await Proyecto.findOne({ _id: id });

    if (!proyecto) {
      const response = new ResponseError(
        'fail',
        'Proyecto no encontrado',
        'No hay ningún proyecto, por favor asigna un proyecto existente',
        []
      ).responseApiError();

      return res.status(404).json(response);
    }

    proyecto.set(nuevoProyecto); // Actualiza los campos con los valores del nuevoProyecto

    await proyecto.save();

    res.status(200).json({
      status: 'successful',
      data: proyecto,
      message: 'Proyecto Actualizado Correctamente',
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al guardar el proyecto',
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};
const borrarProyectos = async (req, res) =>{
 
    const {id} = req.params;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

    try {
        
        const proyectoEliminado = await Proyecto.deleteOne({_id:id});
        
        if (proyectoEliminado.deletedCount === 0) {
            const response = new ResponseError(
              'fial',
              'Proyecto no encontrado',
              'El proyecto no se encuentra al realizar la busqueda',
              []).responseApiError();
      
            return res.status(404).json(
              response
            )
          }
        
        
        res.status(200).json({
            status: 'successful',
            message: 'Proyecto eliminado correctamente',
          });
          console.log('BORRADO')
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'Error al eliminar el proyecto',
            ex.message,
            []).responseApiError();
      
          res.status(500).json(
            response
          )
    }
};





module.exports = {
    crearProyecto,
    mostrarProyectos,
    actualizarProyectos,
    borrarProyectos,
    misProyectos,
    actualizarProyecto,
    borrarProyecto
}