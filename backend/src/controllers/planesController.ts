import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class PlanesController {

// ==================================================
//       Marca la asistencia de un cliente
// ==================================================

public async marcarAsistencia(req: Request, res: Response): Promise<void> {
    // console.log('req.params marcarAsistencia es :  ',req.params);
    // console.log('res damePlanCliente es :  ',res);
    const { id } = req.params;

    const planes = await pool.query('call bsp_marcarAsistencia(?)',id);
    // console.log('todas las planes en damePlanCliente es : ', planes);
    // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

    res.json(planes);
}

// ==================================================
//    Lista el plan activo de un cliente
// ==================================================

public async damePlanCliente(req: Request, res: Response): Promise<void> {
    /// console.log('req.params damePlanCliente es :  ',req.params);
    // console.log('res damePlanCliente es :  ',res);
    const { id } = req.params;

    const planes = await pool.query('call bsp_dame_plan_cliente(?)',id);
    // console.log('todas las planes en damePlanCliente es : ', planes);
    // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

    res.json(planes);
}

// ==================================================
//        Lista planes desde cierto valor
// ==================================================

    public async list(req: Request, res: Response): Promise<void> {
        // console.log('req.body list es :  ',req.body);
        // console.log('req.params list es :  ',req.params);

        var desde = req.params.desde || 0;
        desde  = Number(desde);

        var incluyeBajas = req.params.incluyeBajas || 0;

        const planes = await pool.query('call bsp_listar_planes(?,?)',[desde,incluyeBajas]);
        // console.log('planes en list es : ', planes);
        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

        res.json(planes);
    }

    
// ==================================================
//        Lista todos los planes
// ==================================================

public async listAll(req: Request, res: Response): Promise<void> {
    // console.log('req.body planesController es :  ',req.body);

    // var desde = req.query.desde || 0;
    // desde  = Number(desde);

    const planes = await pool.query('call bsp_listar_todos_planes()');
    // console.log('todas las planes en planesCOntroleer es : ', planes);
    // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

    res.json(planes);
}
// ==================================================
//        Obtiene un plan de la BD
// ==================================================


    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        // console.log('req en planesCOntroleer es : ', req);

        // console.log('id en planesCOntroleer es : ', id);

        const planes = await pool.query('call bsp_dame_plan(?)', [id]);
        // console.log('planes es : ',planes);

        if (planes[0][0].Mensaje !== 'El Plan no existe!') {
            return res.json(planes[0]);
        }
        res.status(404).json({ text: "El plan no existe" });

        
    }

// ==================================================
//        Inserta un plan
// ==================================================


public async create(req: Request, res: Response) {

        // console.log("req.body en planesCntrolles.ts es : ", req.body);

        var CantClases = req.body.CantClases;
        var Plan = req.body.Plan;
        var Precio = req.body.Precio;
        var Descripcion = req.body.Descripcion;
        // var Estado = req.body.Estado;
   

        const result = await pool.query('CALL bsp_alta_plan(?,?,?,?)', [Plan,Precio,Descripcion,CantClases]);

        // console.log("Ingreso hasta aqui y result es : ",result);

        // const result = pool.query("CALL bsp_alta_persona(" + req.body.IdRol + "','" + req.body.IdTipoDocumento + "','" + req.body.Apellido + "','" + req.body.Nombre + "','" + req.body.Documento + "','" + req.body.Password + "','" + req.body.Telefono + "','" + req.body.Sexo + "','" + req.body.Observaciones + "','" + req.body.Foto + "','" + req.body.FechaNac + "','" + req.body.Correo + "','" + req.body.Usuario + "','" + req.body.Calle + "','" + req.body.Piso + "','" + req.body.Departamento + "','" + req.body.Ciudad + "','" + req.body.Pais + "','" + req.body.Numero + ")");
        res.json({ Mensaje: 'Ok' });
        /*
        res.status(201).json({
            ok:true,
            usuariotoken: req.body
        }) */

    }

// ==================================================
//        Actualiza un plan
// ==================================================


    public async update(req: Request, res: Response): Promise<void> {
        

        // console.log('req.params en update plan es ', req.params);
        // console.log('req.body en update plan es ', req.body);
        
        var pIdPlan = req.params.IdPlan;
        var pPlan = req.body.Plan;
        var pPrecio = req.body.Precio;
        var pCantClases = req.body.CantClases;
        var pDescripcion = req.body.Descripcion;
        var pEstado = req.body.EstadoPlan;


        const result = await pool.query('call bsp_modifica_plan(?,?,?,?,?,?)', [pIdPlan,pPlan,pPrecio,pCantClases,pDescripcion,pEstado]);    // <-- CAMBIAR y poner los parametros para que lo reciba bien el SQL
        // console.log('result en update plan es ', result);

        if(result[0][0].Mensaje !== 'Ok'){
            res.json({ Mensaje: result[0][0].Mensaje });
            console.log("Error en la transaccion ");
            return;
        }

        res.json({ Mensaje: 'Ok' });
    }

// ==================================================
//        Da de baja un plan
// ==================================================

    public async baja(req: Request, res: Response): Promise<void> {
        // console.log('entro en darBaja plan y req.params es : ', req.params);
        const { id } = req.params;
        const result = await pool.query('CALL bsp_darbaja_plan(?)', id);

        // console.log('Result es  : ', result[0][0].Mensaje);


        if (result[0][0].Mensaje !== 'Ok'){
            res.json({ Mensaje: result[0][0].Mensaje });
        }
        else{
            res.json(result[0][0].Mensaje);
        }
    }

}

const planesController = new PlanesController;
export default planesController;