"use strict";
exports.__esModule = true;
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// ==================================================
//        TOKEN - importa el orden
// ==================================================
exports.verificaToken = function (req, res, next) {
    var token = req.headers.token;
    jwt.verify(token, SEED, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'TOKEN incorrecto',
                errors: err
            });
        }
        next();
    });
};
// ==================================================
//        Verifica si es ADMIN
// ==================================================
exports.verificaAdmin = function (req, res, next) {
    var IdRol = req.query.IdRol;
    if (IdRol === '3') {
        // Es un ADMIN y todo esta bien
        next();
    }
    else {
        // No es un ADMIN
        // Manejar errores aqui, por que en el navegador se ese error en rojo
        return res.status(401).json({
            ok: false,
            mensaje: 'TOKEN incorrecto - No es ADMIN',
            errors: { messaje: 'No es ADMIN, no puede hacer eso' }
        });
    }
};
// ==================================================
//        Verifica si es ADMIN o un profesional
// ==================================================
exports.verificaProfesionalAdmin = function (req, res, next) {
    var IdRol = req.query.IdRol;
    if (IdRol === '3' || IdRol === '2') {
        // Es un ADMIN y todo esta bien
        next();
    }
    else {
        // No es un ADMIN
        // Manejar errores aqui, por que en el navegador se ese error en rojo
        return res.status(401).json({
            ok: false,
            mensaje: 'TOKEN incorrecto - No es ADMIN o profesional',
            errors: { Mensaje: 'No es ADMIN o profesional, no puede hacer eso' }
        });
    }
};
// ==================================================
//        Verifica si es ADMIN o Mismo usuario
// ==================================================
// Usado para  cuando una persona quiere actualizar su perfil , creo que para nuestra app no sera necesario
exports.verificaAdmin_o_MismoUsuario = function (req, res, next) {
    var persona = req.body.persona;
    var id = req.params.IdPersona;
    if (persona.Rol === 'Profesional' || persona.IdPersona === id) {
        // Es un ADMIN y todo esta bien
        next();
        // return;
    }
    else {
        // No es un ADMIN
        console.log('NO Eres un ADMIN !!!');
        return res.status(401).json({
            ok: false,
            mensaje: 'TOKEN incorrecto ',
            errors: { messaje: 'false' }
        });
    }
};
