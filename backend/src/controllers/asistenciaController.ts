import { Request, Response } from 'express';


import pool from '../database';


class AsistenciaController {


// ==================================================
//        Inserta una asistencia
// ==================================================


public async create(req: Request, res: Response) {

    console.log("req.body en medicionesCntrolles.ts es : ", req.body);

    var IdPersona = req.body.IdCliente;
    var IdProfesional = req.body.IdProfesional;
    var Altura = req.body.Altura;
    var Peso = req.body.Peso;
    var IMC = req.body.IMC;
    var Musc = req.body.Musc;
    var Grasa = req.body.Grasa;
    var GV = req.body.GV;


    console.log("Altura en personasCntrolles.ts es : ", Altura);

    const result = await pool.query('CALL bsp_alta_medicion(?,?,?,?,?,?,?,?)', [IdPersona,IdProfesional,Altura,Peso,IMC,Musc,Grasa,GV]);

    console.log("Ingreso hasta aqui y result es : ",result);

    res.json({ message: 'Medicion guardada' });

}

// ==================================================
//  Lista las asistencias desde cierto valor y dado un IdPersona
// ==================================================

public async listarAsistencias(req: Request, res: Response) {

     var desde = req.params.desde || 0;
     desde  = Number(desde);

     var IdPersona = req.params.IdPersona;

     const asistencias = await pool.query('call bsp_listar_asistencias_cliente(?,?)',[desde,IdPersona]);
     console.log('asistencias en personasCOntroleer es : ', asistencias);

    res.json(asistencias);


 }
// ==================================================
//        Obtiene una asistencia de la BD
// ==================================================

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        console.log('id en AsistenciaController : ',id);

        const asistencia = await pool.query('call bsp_dame_total_asistencia(?)', [id]);
        console.log('asistencia es : ',asistencia);

        if(asistencia[0][0].Mensaje !== 'Ok'){
            return res.json({
                // ok: false,
                Mensaje: asistencia.Mensaje
            });
        }
    
        console.log("Ingreso hasta aqui en asistencia y asistencia es : ",asistencia);
    
        return res.json({ Mensaje: 'Ok' });

        
    }

// ==================================================
//  Marca la asistencia dado un IdPersona y un IdPlan
// ==================================================

public async marcarAsistenciaPersona(req: Request, res: Response): Promise<any> {
    const IdPersona = req.params.IdPersona;
    // const IdPlan = req.params.IdPlan;

    console.log('IdPersona en marcarAsistenciaPersona : ',IdPersona);
    // console.log('IdPlan en marcarAsistenciaPersona : ',IdPlan);


    const asistencia = await pool.query('call bsp_marcar_asistencia(?)', IdPersona);
    console.log('asistencia marcarAsistenciaPersona es : ',asistencia);

    if(asistencia[0][0].Mensaje !== 'Ok'){
        return res.json({
            // ok: false,
            Mensaje: asistencia.Mensaje
        });
    }

    console.log("Ingreso hasta aqui en asistencia y asistencia es : ",asistencia);

    return res.json({ Mensaje: 'Ok' });
}

    
}


const asistenciaController = new AsistenciaController;
export default asistenciaController;