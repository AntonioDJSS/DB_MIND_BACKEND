const Evaluacion = require('../models/evaluacion'); // Asegúrate de especificar la ruta correcta

const crearEvaluacion = async (req, res) => {
  try {
    const { cursoID, preguntas } = req.body;

    // Verificar si los campos requeridos están presentes y no son nulos
    if (!cursoID || !preguntas) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    // Verificar que haya al menos una pregunta
    if (preguntas.length === 0) {
      return res.status(400).json({ msg: 'Debes proporcionar al menos una pregunta' });
    }

    // Prevenir evaluaciones duplicadas por cursoID
    const evaluacionExistente = await Evaluacion.findOne({ cursoID });
    if (evaluacionExistente) {
      return res.status(400).json({ msg: 'La evaluación para este curso ya existe' });
    }

    // Crear una nueva instancia de Evaluacion
    const evaluacion = new Evaluacion({
      cursoID,
      preguntas,
    });

    // Guardar la evaluación
    const evaluacionGuardada = await evaluacion.save();

    res.status(201).json({ evaluacion: evaluacionGuardada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la evaluación', details: err });
  }
};

const obtenerEvaluaciones = async (req, res) => {
    try {
        const evaluaciones = await Evaluacion.find();

        res.json(evaluaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las evaluaciones', details: error });
    }
};

const getEvalucionById = async (req, res) => {
  const { id } = req.params;
  const evaluacion = await Evaluacion.findById(id);

  if (!evaluacion) {
    return res.status(404).json({ msg: "No encontrado" });
  }
  res.json(evaluacion);
};

module.exports = {
  crearEvaluacion,
  obtenerEvaluaciones,
  getEvalucionById
};
