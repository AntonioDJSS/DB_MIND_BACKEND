const Usuario = require("../models/usuario")

const obtenerUsuarios = async (req, res) => {
    try {
        const usuario = await Usuario.find();

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error });
    }
};

module.exports = {
    obtenerUsuarios
}