const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { body } = require("express-validator");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require('../models/usuario');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {


        //verificar si el email exite
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -correo'
            })
        }
        //si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos-estado: false'
            })
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -passwrd'
            })
        }

        //generar el jwt
        const token = await generarJWT(usuario.id);



        res.json({
            usuario,
            token

        })

    } catch (error) {

        return res.status(500).json({
            msg: 'Hablee con el admin'

        })
    }




}
module.exports = {
    login
}