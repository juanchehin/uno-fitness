var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

import { Request, Response, NextFunction } from 'express';


// ==================================================
//        TOKEN - importa el orden
// ==================================================

exports.verificaToken = function(req: Request,res:Response,next: NextFunction){

// var token = req.query.token;
var token = req.headers.token;

jwt.verify(token , SEED, (err: any,decoded: any) =>{

    if(err){
        return res.status(401).json({
            ok:false,
            mensaje: 'TOKEN incorrecto',
            errors: err
        });
    }
    next();

});

}

// ==================================================
//        Verifica si es ADMIN
// ==================================================

exports.verificaAdmin = function(req: Request,res:Response,next: NextFunction){

    var IdRol = req.query.IdRol;

    console.log('req.query en exports.verificaAdmin es : ', req.query);

    if(IdRol === '3'){
        // Es un ADMIN y todo esta bien
        console.log('Eres ADMIN !!!');
        next();
    } else {
        // No es un ADMIN
        // Manejar errores aqui, por que en el navegador se ese error en rojo
        console.log('NO Eres un ADMIN !!!');
        return res.status(401).json({
                ok:false,
                mensaje: 'TOKEN incorrecto - No es ADMIN',
                errors: { messaje : 'No es ADMIN, no puede hacer eso'}
        });
    }

}

// ==================================================
//        Verifica si es ADMIN o un profesional
// ==================================================

exports.verificaProfesionalAdmin = function(req: Request,res:Response,next: NextFunction){

    var IdRol = req.query.IdRol;

    console.log('IdRol en exports.verificaProfesionalAdmin es : ', IdRol);


    if(IdRol === '3' || IdRol === '2'){
        // Es un ADMIN y todo esta bien
        console.log('Eres ADMIN o profesional !!!');
        next();
    } else {
        // No es un ADMIN
        // Manejar errores aqui, por que en el navegador se ese error en rojo
        console.log('NO Eres un ADMIN o profesional!!!');
        return res.status(401).json({
                ok:false,
                mensaje: 'TOKEN incorrecto - No es ADMIN o profesional',
                errors: { Mensaje : 'No es ADMIN o profesional, no puede hacer eso'}
        });
    }

}

// ==================================================
//        Verifica si es ADMIN o Mismo usuario
// ==================================================

// Usado para  cuando una persona quiere actualizar su perfil , creo que para nuestra app no sera necesario

exports.verificaAdmin_o_MismoUsuario = function(req: Request,res:Response,next: NextFunction){

    var persona = req.body.persona;
    var id = req.params.IdPersona;

    console.log('Persona en verificaAdmin_o_MismoUsuario es : ', persona);


    if(persona.Rol === 'Profesional' || persona.IdPersona === id){
        // Es un ADMIN y todo esta bien
        console.log('Eres ADMIN o mismo usuario!!!');
        next();
        // return;
    } else {
        // No es un ADMIN
        console.log('NO Eres un ADMIN !!!');
        return res.status(401).json({
                ok:false,
                mensaje: 'TOKEN incorrecto - No es ADMIN ni el mismo usuario',
                errors: { messaje : 'No es ADMIN ni el mismo usuario, no puede hacer eso'}
            });
    }

}