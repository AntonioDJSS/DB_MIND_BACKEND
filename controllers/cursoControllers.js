const Curso = require('../models/curso'); // Asegúrate de que la ruta sea correcta

// Controlador para crear un nuevo curso
const crearCurso = async (req, res) => {
  const { nombre, descripcion, imagen, modulo1, modulo2, modulo3 } = req.body;

  // Verificar si los campos requeridos están presentes y no son nulos
  if (!nombre || !descripcion || !imagen || !modulo1 || !modulo2 || !modulo3) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
  }

  // Verificar los campos dentro de modulo1, modulo2 y modulo3
  const verificarModulo = (modulo) => {
      const { nombreModulo, imagen: moduloImagen, bloqueIntroduccion, bloqueDesarrollo, bloqueFinal } = modulo;
      if (!nombreModulo || !moduloImagen || !bloqueIntroduccion || !bloqueDesarrollo || !bloqueFinal) {
          return false;
      }
      const { texto: introduccionTexto, codigo: introduccionCodigo } = bloqueIntroduccion;
      const { texto: desarrolloTexto, codigo: desarrolloCodigo } = bloqueDesarrollo;
      const { texto: finalTexto, codigo: finalCodigo } = bloqueFinal;
      return !(!introduccionTexto || !introduccionCodigo || !desarrolloTexto || !desarrolloCodigo || !finalTexto || !finalCodigo);
  };

  if (!verificarModulo(modulo1) || !verificarModulo(modulo2) || !verificarModulo(modulo3)) {
      return res.status(400).json({ msg: 'Faltan campos en módulos' });
  }

  // Prevenir cursos duplicados
  const cursoExistente = await Curso.findOne({ nombre });
  if (cursoExistente) {
      return res.status(400).json({ msg: 'El curso ya existe' });
  }

  try {
      // Guardar el curso
      const curso = new Curso(req.body);
      const cursoGuardado = await curso.save();
      res.json({ cursoGuardado });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error al crear el curso', details: err });
  }
};

const obtenerCursoPorId = async (req, res) => {
  const { id } = req.params;
  const curso = await Curso.findById(id);

  if (!curso) {
    return res.status(404).json({ msg: "No encontrado" });
  }
  res.json(curso);
};

// Controlador para obtener todos los cursos
const obtenerTodosLosCursos = async (req, res) => {
    try {
        const cursos = await Curso.find();

        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los cursos', details: error });
    }
};

module.exports = {
    crearCurso,
    obtenerCursoPorId,
    obtenerTodosLosCursos
};
