const ResponseError = require("../utils/ResponseError");
const Respuesta = require("../models/respuesta");
const Evaluacion = require("../models/evaluacion");
const mongoose = require("mongoose");
const Usuario = require("../models/usuario");

const convertirCalificacion = (calificacion) => {
  // Realiza la conversión de calificaciones según el patrón
  switch (calificacion) {
    case 1:
      return 2;
    case 2:
      return 4;
    case 3:
      return 6;
    case 4:
      return 8;
    case 5:
      return 10;
    // Agrega más casos según sea necesario
    default:
      return calificacion;
  }
};

const crearRespuesta = async (req, res) => {
  let usuarioExiste = null;
  const {
    respuesta01,
    respuesta02,
    respuesta03,
    respuesta04,
    respuesta05,
    curso,
  } = req.body;
  const usuario = req.usuario;

  if (!usuario) {
    // Manejo de error cuando no se encuentra el usuario
    const response = new ResponseError(
      "fail",
      "El usuario no existe en la ruta",
      "El usuario no fue encontrado en la request",
      []
    ).responseApiError();

    return res.status(404).json(response);
  }

  try {
    usuarioExiste = await Usuario.findById(usuario.id);
  } catch (ex) {
    const response = new ResponseError(
      "fail",
      "Error al realizar la consulta en la Base de Datos",
      ex.message,
      []
    ).responseApiError();

    res.status(404).json(response);
  }

  if (!usuarioExiste) {
    // Manejo de error cuando el usuario no existe en la base de datos
    const response = new ResponseError(
      "fail",
      "El usuario no existe en la BD",
      "Ingresa un usuario existente por favor, ya que no se encuentra en la BD",
      []
    ).responseApiError();

    return res.status(404).json(response);
  }

  const nuevaRespuesta = new Respuesta({
    respuesta01,
    respuesta02,
    respuesta03,
    respuesta04,
    respuesta05,
    usuario: usuario._id,
    curso,
  });

  try {
    await nuevaRespuesta.save();

    // Después de guardar la respuesta, busca la evaluación correspondiente por curso ID
    const evaluacion = await Evaluacion.findOne({ _id: curso });

    if (evaluacion) {
      // Si se encuentra una evaluación, actualiza la propiedad evaluacion de la respuesta
      nuevaRespuesta.evaluacion = evaluacion;

      // Compara las respuestas con las respuestas correctas de la evaluación
      let calificacion = 0;
      evaluacion.preguntas.forEach((pregunta, index) => {
        const respuestaCorrecta = pregunta.respuestaCorrecta;
        const respuestaUsuario = nuevaRespuesta[`respuesta0${index + 1}`];
        if (respuestaUsuario === respuestaCorrecta) {
          calificacion++;
        }
      });

      // Realiza la conversión de calificación
      const calificacionConvertida = convertirCalificacion(calificacion);

      nuevaRespuesta.calificacion = calificacionConvertida;
      await nuevaRespuesta.save();
    }

    // En caso de éxito, envía una respuesta con un mensaje de éxito
    res.status(200).json({
      status: "success",
      data: nuevaRespuesta,
      message: "Respuestas Guardadas y Calificadas Correctamente",
    });
  } catch (ex) {
    const response = new ResponseError(
      "fail",
      "No se pudo crear la respuesta",
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};

const obtenerRespuestasPorUsuario = async (req, res) => {
  const usuarioId = req.usuario._id; // Obtén el ID del usuario autenticado

  try {
    const respuestas = await Respuesta.find({ usuario: usuarioId }).exec();

    res.status(200).json({
      status: 'success',
      data: respuestas,
      message: 'Respuestas obtenidas correctamente'
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al obtener las respuestas',
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};

const obtenerRespuestas = async (req, res) => {
  try {
      const respuestas = await Respuesta.find();

      res.json(respuestas);
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener las respuestas', details: error });
  }
};

module.exports = {
  crearRespuesta,
  obtenerRespuestasPorUsuario,
  obtenerRespuestas
};
