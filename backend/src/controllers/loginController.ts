import { Request, Response } from 'express';

var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

import pool from '../database';

class LoginController {

// ========================================================
//                    LOGUEO
// ========================================================

public async log(req: Request, res: Response): Promise<void>{

    var body = req.body;    // Usuario y contraseña

    menu = [];

console.log('body es ',body);

console.log('ingresa logincontroller , ahora va el token');

var user = body.Correo;


// Verifico si existe un usuario con ese correo
const result = await pool.query("call bsp_dame_persona_correo_pass(?,?)",[body.Correo,body.Password]);



if(result[0][0].Mensaje !== 'Ok' || null){
    console.log('Error de credenciales');

    // Quitar esto para produccion
    res.json({
        ok: true,
        mensaje : 'Error de credenciales'
        // token: token,
        // id: IdPersona
            // body: body
    });  
    return;
}


console.log('USUARIO Y CONTRASEÑA CORRECTOS');
// this.actualizaEstadoCliente();

// Si llego hasta aqui es por que el correo y la contraseña estan bien

// Ahora genero el TOKEN con la libreria jwt
var token = jwt.sign({ usuario: body.correo }, SEED, { expiresIn: 14400});
// var menu = this.obtenerMenu(result[0][0].IdRol)

console.log('result[0][0].IdRol ' , result[0][0].IdRol);

// ==========================================
//  IdRol 1 - Clientes
// ==========================================

if(result[0][0].IdRol === 1) {
    console.log('Entro en el IDROL 1 ');

    menu = [
            // titulo: 'Principal',
            // icono: 'mdi mdi-gauge',
            // submenu: [
                // { titulo: 'principal', url: '/principal' , icono :'signal_cellular_alt'},
                { titulo: 'Mis mediciones', url: '/cliente/mediciones',icono :'format_list_bulleted' },
                { titulo: 'Mis asistencias', url: '/cliente/asistencias',icono :'assignment_turned_in' },
                { titulo: 'Mis graficas', url: '/cliente/graficas',icono :'insert_chart_outlined' }
                // { titulo: 'Promesas', url: '/promesas' },
                // { titulo: 'RxJs', url: '/rxjs' }
            ]
            // Se ejecuta una actualizacion de cliente cada vez que accede de forma exitosa, verifica la cantidad de clases
            // su estado , si tiene meses de credito , etc
            console.log('Justo antes de actualiza estado cliente y IdPeronsa es ',result[0][0].IdPersona);
            const respuesta = await pool.query('call bsp_actualiza_estado_cliente(?)',result[0][0].IdPersona);
            console.log('respuesta es await',respuesta);
        }

// ==========================================
//  IdRol 2 - Profesionales
// ==========================================

if(result[0][0].IdRol === 2) {
    console.log('Entro en el IDROL 2 ');

    var menu = [
            // titulo: 'Principal',
            // icono: 'mdi mdi-gauge',
            // submenu: [
                // { titulo: 'Profesionales', url: '/mantenimiento/profesionales', icono :'sports_kabaddi' },
                { titulo: 'Clientes', url: '/mantenimiento/clientes' , icono :'group'},
                { titulo: 'Caja', url: '/cajas' , icono :'attach_money'},
                // { titulo: 'Planes', url: '/mantenimiento/planes' , icono :'dehaze'}
            ]
        }
    // ];

// ==========================================
//  IdRol 3 - Administrador
// ==========================================

if(result[0][0].IdRol === 3) {
    console.log('Entro en el IDROL 3 ');

    menu = [
            // titulo: 'Principal',
            // icono: 'mdi mdi-gauge',
            // submenu: [
                { titulo: 'Personal', url: '/mantenimiento/profesionales', icono :'group' },
                { titulo: 'Clientes', url: '/mantenimiento/clientes' , icono :'sports_kabaddi'},
                { titulo: 'Caja', url: '/cajas' , icono :'attach_money'},
                { titulo: 'Planes', url: '/mantenimiento/planes' , icono :'dehaze'}
            ]
        }

res.status(200).json({
    ok: true,
    usuario: result[0][0].correo,
    IdRol: result[0][0].IdRol,
    token: token,    // <-- Devuelvo el token al front end
    id: result[0][0].IdPersona,
    menu: menu
});
}


// ==========================================
//  Renueva TOKEN
// ==========================================
public async renuevatoken(req: Request, res: Response): Promise<void> {
    
    var body = req.body;    // Usuario y contraseña

    var token = jwt.sign({ usuario: body.correo }, SEED, { expiresIn: 14400});// 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

}
// ==================================================
//   Actualiza el estado de un cliente
// ==================================================


public async actualizaEstadoCliente(req: Request, res: Response): Promise<void> {
    console.log(' req.params en actualizaEstadoCliente ', req.params);

    const IdPersona = req.params.IdPersona;

     const respuesta = await pool.query('call bsp_actualiza_estado_cliente(?)',IdPersona);
     console.log('respuesta en actualizaEstadoCliente es : ', respuesta);

     res.json(respuesta);
 }

}

const loginController = new LoginController;
export default loginController;