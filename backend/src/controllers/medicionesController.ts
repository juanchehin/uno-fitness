import { Request, Response } from 'express';


import pool from '../database';


class MedicionesController {

// ==================================================
//        Lista las mediciones dado un cliente
// ==================================================


public async listarMediciones(req: Request, res: Response): Promise<void> {
    console.log('req.body en listarMediciones ',req.body);
    console.log(' req.params en listarMediciones ', req.params);

    console.log(' req.params.id en listarMediciones ', req.params.id);
    console.log(' req.params.desde en listarMediciones ', req.params.desde);

    const id = req.params.id;
    var desde = req.params.desde || 0;
    desde  = Number(desde);

     const mediciones = await pool.query('call bsp_listar_mediciones(?,?)',[desde,id]);
     console.log('mediciones en medicionesCOntroleer es : ', mediciones);

     res.json(mediciones);
 }

// ==================================================
//        Inserta una medicion
// ==================================================


public async nuevaMedicion(req: Request, res: Response) {

    console.log("req.body en nuevaMedicion.ts es : ", req.body);

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

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            // ok: false,
            Mensaje: result[0][0].Mensaje
        });
    }

    console.log("Ingreso hasta aqui en nuevaMedicion  y result es : ",result);

    res.json({ Mensaje: 'Ok' });

}


// ==================================================
//        Obtiene una medicion de la BD
// ==================================================


    public async getOne(req: Request, res: Response): Promise<any> {
        const { IdMedicion } = req.params;
        console.log('id en medicionesController : ',IdMedicion);

        const medicion = await pool.query('call bsp_dame_medicion(?)', IdMedicion);
        console.log('medicion es : ',medicion);

        if (medicion[1][0].Mensaje === 'Ok') {
            return res.json(medicion[0][0]);
        }

        res.status(404).json({ text: medicion[1][0].Mensaje });

        
    }
// ==================================================
//        Editar una medicion de la BD
// ==================================================


public async actualizarMedicion(req: Request, res: Response): Promise<any> {
    console.log("req.body en actualizarMedicion es : ", req.body);

    var Altura = req.body.Altura;
    var Peso = req.body.Peso;
    var IMC = req.body.IMC;
    var Musc = req.body.Musc;
    var Grasa = req.body.Grasa;
    var GV = req.body.GV;
    // var IdCliente = req.body.IdCliente;
    var IdProfesional = req.body.IdProfesional;
    var IdMedicion = req.body.IdMedicion;



    const result = await pool.query('CALL bsp_actualiza_medicion(?,?,?,?,?,?,?,?)', [IdMedicion,IdProfesional,Altura,Peso,IMC,Musc,Grasa,GV]);

    console.log("Ingreso hasta aqui en actualizarMedicion y result es : ", result);

    console.log("Ingreso hasta aqui en actualizarMedicion y result[0][0].Mensaje es : ",result[0][0].Mensaje);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            mensaje: result[0][0].Mensaje
        });
    }

    console.log("Ingreso hasta aqui en actualizarMedicion  y result es : ",result);

    res.json({ message: 'Ok' });

    
}

 // ==================================================
//   Elimina una medicion
// ==================================================

public async eliminarMedicion(req: Request, res: Response) {


    console.log("req.body en eliminarMedicion es : ", req.params);

    var IdMedicion = req.params.id;


    const result = await pool.query('CALL bsp_eliminar_medicion(?)',IdMedicion);

    console.log("Ingreso hasta aqui en eliminarMedicion y result : ",result);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            Mensaje: result.Mensaje
        });
    }

    console.log("Ingreso hasta aqui en eliminarMedicion y result es : ",result);

    return res.json({ Mensaje: 'Ok' });

}

}


const medicionesController = new MedicionesController;
export default medicionesController;