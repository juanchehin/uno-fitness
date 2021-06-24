import { Request, Response, NextFunction } from 'express';

var fileUpload = require('express-fileupload');
// const cors = require("cors");

var fs = require('fs');
import pool from '../database';

const path = require('path');

// var bcrypt = require('bcryptjs');

class CajaController {


// ==================================================
//  Lista los movimientos de un cierto cliente
// ==================================================

public async dameMovimientosClientes(req: Request, res: Response): Promise<void> {
        const id = req.query.id;
        const desde= req.query.desde;
        // console.log('id en medicionesController : ',id);
        // console.log('desde en medicionesController : ',desde);
        // console.log('req query en dameMovimientosClientes : ',req.query);
        // console.log('req.param en dameMovimientosClientes : ',req.params);
        


        const movimientos = await pool.query('call bsp_movimientos_cliente(?,?)', [id,desde]);
        console.log('movimientos es : ',movimientos);

        res.json(movimientos);

        // if (medicion[0][0].Mensaje !== 'La medicion no existe!') {
        //     return res.json(medicion[0]);
        // }

        // res.status(404).json({ text: "La medicion no existe" });


 }
    

// ==================================================
//        Lista las transacciones
// ==================================================

public async list(req: Request, res: Response): Promise<void> {
    console.log('req.body en caja listar transacciones es ',req.body);
    console.log('req.params en caja listar transacciones es ',req.params);


    var desde = req.params.desde || 0;
    desde  = Number(desde);

    var FechaInicio = req.params.FechaInicio;
    var FechaFin = req.params.FechaFin;


     const transacciones = await pool.query('call bsp_listar_transacciones(?,?,?)', [desde,FechaInicio,FechaFin]);

     console.log('transacciones despues de la carga es personasCOntroleer es : ', transacciones);

     res.json(transacciones);

 }
// ======================================================================================================================
// ================================= INGRESOS ==========================================================================
// ======================================================================================================================


// ==================================================
//        Lista los ingresos
// ==================================================

public async listarIngresos(req: Request, res: Response): Promise<void> {

     var desde = req.params.desde || 0;
     desde  = Number(desde);

     var FechaInicio = req.params.FechaInicio;
     var FechaFin = req.params.FechaFin;

     const ingresos = await pool.query('call bsp_listar_ingresos(?,?,?)', [desde,FechaInicio,FechaFin]);

     console.log('ingresos despues de la carga es ingresos personasCOntroleer es : ', ingresos);

     res.json(ingresos);

 }

// ==================================================
//        Inserta un ingreso
// ==================================================


public async createIngreso(req: Request, res: Response) {

    console.log("req.body en createIngreso.ts es : ", req.body);

    var pIdPersona = req.body.IdPersona;
    var pIdPlan = req.body.IdPlan;
    var pCantidad = req.body.Cantidad;
    var pDescripcion = req.body.Detalle;



    const result = await pool.query('CALL bsp_alta_ingreso(?,?,?,?)', [pIdPersona,pIdPlan,pCantidad,pDescripcion]);

    console.log("result en createIngreso.ts es : ", result);

    console.log("result[0][0].Mensaje en createIngreso.ts es : ", result[0][0].Mensaje);


    if(result[0][0].Mensaje !== 'Ok'){
        res.json({ message: result[0][0].Mensaje });
        console.log("Error en la transaccion ");
        return;
    }

    console.log("No hay Error en la transaccion  ");

    res.json({ Mensaje: 'Ok' });


}
// ===========================================================================================================
// ================================ EGRESOS =================================================================
// ===========================================================================================================


// ==================================================
//        Lista los egresos - HACER PARA QUE SEA ENTRE FECHAS
// ==================================================

public async listarEgresos(req: Request, res: Response): Promise<void> {
    console.log('req.body en caja listar egresos es ',req.body);

     var desde = req.query.desde || 0;
     desde  = Number(desde);

     var FechaInicio = req.params.FechaInicio;
     var FechaFin = req.params.FechaFin;

     const egresos = await pool.query('call bsp_listar_egresos(?,?,?)', [desde,FechaInicio,FechaFin]);

     console.log('egresos despues de la carga es egresos personasCOntroleer es : ', egresos);

     res.json(egresos);

 }

// ==================================================
//        Inserta un egreso
// ==================================================


public async createEgreso(req: Request, res: Response) {

    console.log("req en createEgreso.ts es : ", req.body);


    var Monto = req.body.Monto;
    var Cantidad = req.body.Cantidad;
    var Detalle = req.body.Detalle;
    var pIdPersona = req.body.IdPersona;

    const result = await pool.query('CALL bsp_alta_egreso(?,?,?,?)', [Monto,pIdPersona,Cantidad,Detalle]);

    console.log("Ingreso hasta aqui y result en caja es : ",result);

    res.json({ Mensaje: 'Ok' });


}

}

const cajaController = new CajaController;
export default cajaController;