import { Request, Response, NextFunction, response } from 'express';
import pool from '../database';
const path = require('path');

class PersonasController {
 // ==================================================
//        Lista los roles del sistema
// ==================================================

public async listarRoles(req: Request, res: Response): Promise<void> {
    console.log('req.body en listarRoles ',req.body);


     const roles = await pool.query('call bsp_listar_roles()');

     console.log('roles en listarRoles ',roles);

     res.json(roles);
 }
// ==================================================
//        Lista personas desde cierto valor
// ==================================================

    public async list(req: Request, res: Response): Promise<void> {
       console.log('req.body es ',req.body);

        var desde = req.query.desde || 0;
        desde  = Number(desde);

        const personas = await pool.query('call bsp_listar_personas(?)',[desde]);
        // console.log('Personas en personasCOntroleer es : ', personas);
        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

        res.json(personas);
    }

// ==================================================
//        Obtiene una personas de la BD
// ==================================================


    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        console.log('Entro en getOne y el req.params es : ',req.params);

        const personas = await pool.query('call bsp_dame_persona(?)', [id]);
        console.log('personas es : ',personas);

        if (personas[0][0].Mensaje !== 'La persona no existe!') {
            return res.json(personas[0]);
        }
        res.status(404).json({ text: "La personas no existe" });

        
    }

// ==================================================
//        Busqueda por nombre - apellido , filtra por plan y si incluye a los clientes dados de baja o no
// ==================================================


public async buscarPorPlanEstado(req: Request, res: Response): Promise<any> {
    let Apellido = req.params.Apellido;
    let Nombre = req.params.Nombre;
    const IdPlan = req.params.IdPlan;
    // const Estado = req.params.Estado;

    if(Apellido === 'null')
        Apellido = '';

    if(Nombre === 'null')
        Nombre = '';

    console.log("req.params es buscarPorPlanEstado : ",req.params);
    console.log("Nombre es buscarPorPlanEstado : ",Nombre);
    console.log("Apellido es buscarPorPlanEstado : ",Apellido);

    const clientes = await pool.query('call bsp_buscar_cliente_plan_estado(?,?,?)', [Apellido,Nombre,IdPlan]);

    console.log("personas buscarPorPlanEstado es : ",clientes);

    res.json(clientes);


}


// ==================================================
//        Busqueda por nombre - apellido
// ==================================================


public async buscar(req: Request, res: Response): Promise<any> {
    const busqueda = req.params.busqueda;
    console.log("busqueda es : ",busqueda);
    const personas = await pool.query('call bsp_buscar_persona(?)',busqueda);
    console.log("personas es : ",personas);

    res.json(personas);


}

// ==================================================
//        Actualiza una persona
// ==================================================


    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        // const ViejaPersona = req.body;
        // const result = pool.query("CALL bsp_alta_persona(" + req.body.IdRol + "','" + req.body.IdTipoDocumento + "','" + req.body.Apellido + "','" + req.body.Nombre + "','" + req.body.Documento + "','" + req.body.Password + "','" + req.body.Telefono + "','" + req.body.Sexo + "','" + req.body.Observaciones + "','" + req.body.Foto + "','" + req.body.FechaNac + "','" + req.body.Correo + "','" + req.body.Usuario + "','" + req.body.Calle + "','" + req.body.Piso + "','" + req.body.Departamento + "','" + req.body.Ciudad + "','" + req.body.Pais + "','" + req.body.Numero + ")");

        await pool.query('bsp_modifica_persona(?,?)', [req.body, id]);
        res.json({ message: "La persona se actualizo" });
    }

// ==================================================
//        Da de baja una persona
// ==================================================

    public async baja(req: Request, res: Response): Promise<void> {
        const id = req.query.termino;
        console.log('Id en baja personasController es : ', id);
        console.log('req.params en baja personasController es : ', req.params);
        console.log('req.query en baja personasController es : ', req.query);


        const result = await pool.query('CALL bsp_darbaja_persona(?)', [id]);
        console.log('result en baja personasController es ',result);
        // await pool.query('DELETE FROM games WHERE id = ?', [id]);
        res.json({ message: "Persona dada de baja" });
    }

    
// ===========================================================================
// =========================== CLIENTES ==========================================
// ===========================================================================


// ==================================================
//        Inserta un cliente
// ==================================================


public async createCliente(req: Request, res: Response) {


    console.log("req.body en createCliente es : ", req.body);

    //var IdRol = 1;
    var IdTipoDocumento = req.body.IdTipoDocumento;
    var Apellidos = req.body.Apellidos;
    var Nombres = req.body.Nombres;
    var Documento = req.body.Documento;
    // var Password = bcrypt.hashSync(req.body.Password,10);         // Encriptacion de una sola via
    var Password = req.body.Password;
    var Telefono = req.body.Telefono;
    var Sexo = req.body.Sexo;
    var Observaciones = req.body.Observaciones;
    // var Foto = req.body.Foto;
    var FechaNac = req.body.FechaNac;
    var Correo = req.body.Correo;
    var Usuario = req.body.Usuario;
    var Calle = req.body.Calle;
    var Piso = req.body.Piso;
    var Departamento = req.body.Departamento;
    var Ciudad = req.body.Ciudad;
    var Pais = req.body.Pais;
    var Numero = req.body.Numero;    // 19
    // var IdPlan = req.body.IdPlan;
    var Objetivo = req.body.Objetivo;
    var Ocupacion = req.body.Ocupacion;
    var Horario = req.body.Horario;

    const result = await pool.query('CALL bsp_alta_cliente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [IdTipoDocumento,Apellidos,Nombres,Documento,Password,Telefono,Sexo,Observaciones,FechaNac,Correo,Usuario,Calle,Piso,Departamento,Ciudad,Pais,Numero,Objetivo,Ocupacion,Horario]);

    console.log("Ingreso hasta aqui en createCliente alta y result es : ",result);
    console.log("Ingreso hasta aqui en createCliente alta y result[0] es : ",result[0]);
    // console.log("Ingreso hasta aqui en createCliente alta y result[1] es : ",result[1]);
    // console.log("Ingreso hasta aqui en result[0][0].Mensaje alta y result[0][0].Mensaje es : ",result[0][0]);
    // console.log("Ingreso hasta aqui en result[1][0].IdPersona alta y result[1] es : ",result[1][0]);
    // console.log("Ingreso hasta aqui en result[0][0].Mensaje alta y result[0][0].Mensaje es : ",result[0][0].Mensaje);
    // console.log("Ingreso hasta aqui en result[1][0].IdPersona alta y result[1] es : ",result[1][0].IdPersona);
    // var IdPersona = Number(result[1][0].IdPersona);
    // var pIdPersona = JSON.parse(result[1][0].IdPersona);
    // var pIdPersona = JSON.stringify(result[1][0].IdPersona);
    // console.log("Ingreso hasta aqui en createCliente alta y result[1][0].IdPersona es : ",result[1][0].IdPersona);

    if(result[0][0].Mensaje === 'La persona ya se encuentra cargada'){
        return res.json({
            Mensaje: result[0][0].Mensaje,
            pIdPersona: result[1][0].IdPersona
        });
    }

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            Mensaje: result[0][0].Mensaje
        });
    }

    console.log("Ingreso hasta aqui en clientes alta y result es : ",result);

    return res.json({ Mensaje: 'Ok' });

}


// ==================================================
//   Activa un cliente (caso de ya existencia en la BD)
// ==================================================


public async activarCliente(req: Request, res: Response) {

    console.log("req.params en activarCliente es : ", req.params);

    var IdPersona = req.params.IdPersona;

    const result = await pool.query('CALL bsp_activar_cliente(?)',IdPersona);

    console.log("Ingreso hasta aqui en activarCliente y result es : ", result);

    console.log("Ingreso hasta aqui en activarCliente y result[0][0].Mensaje es : ",result[0][0].Mensaje);
    


    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            mensaje: result[0][0].Mensaje
        });
    }

    console.log("Ingreso hasta aqui en activarCliente y result es : ",result);

    return res.json({ Mensaje: 'Ok' });

}


// ==================================================
//        Lista Clientes desde cierto valor
// ==================================================

public async listarClientes(req: Request, res: Response): Promise<void> {
    console.log('req.body en clientes ',req.body);

     var desde = req.params.desde || 0;
     // var estado = req.params.estado || 'A';
     desde  = Number(desde);
     // estado  = Number(estado);


     const clientes = await pool.query('call bsp_listar_clientes_estado(?)',[desde]);
     console.log('clientes en personasCOntroleer es : ', clientes);
     // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));

     res.json(clientes);
 }

// ==================================================
//   Elimina un cliente de la BD
// ==================================================

public async eliminarCliente(req: Request, res: Response) {


    console.log("req.body en eliminarCliente es : ", req.params);

    var IdPersona = req.params.IdPersona;


    const result = await pool.query('CALL bsp_eliminar_cliente(?)',IdPersona);

    console.log("Ingreso hasta aqui en eliminarCliente y result : ",result);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            mensaje: result.Mensaje
        });
    }

    console.log("Ingreso hasta aqui en eliminarCliente y result es : ",result);

    return res.json({ mensaje: 'Ok' });

}

// ==================================================
//        Edita un cliente
// ==================================================


public async actualizaCliente(req: Request, res: Response) {

    var IdPersona = req.body.IdPersona;
    var IdTipoDocumento = req.body.IdTipoDocumento;
    var Apellido = req.body.Apellidos;
    var Nombre = req.body.Nombres;
    var Documento = req.body.Documento;
    var Password = req.body.Password;
    var Telefono = req.body.Telefono;
    var Sexo = req.body.Sexo;
    var Observaciones = req.body.Observaciones;
    var FechaNac = req.body.FechaNac;
    var Correo = req.body.Correo;
    var Usuario = req.body.Usuario;
    var Calle = req.body.Calle;
    var Piso = req.body.Piso;
    var Departamento = req.body.Departamento;
    var Ciudad = req.body.Ciudad;
    var Pais = req.body.Pais;
    var Numero = req.body.Numero;    // 20
    var Objetivo = req.body.Objetivo;
    var Ocupacion = req.body.Ocupacion;
    var Horario = req.body.Horario;

    const result = await pool.query('CALL bsp_editar_cliente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
    [IdPersona,IdTipoDocumento,Apellido,Nombre,Documento,Password,Telefono,Sexo,Observaciones,FechaNac,Correo,Usuario,Calle,Piso,Departamento,Ciudad,Pais,Numero,Objetivo,Ocupacion,Horario]);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            Mensaje: result[0][0].Mensaje
        });
    }

    res.json({ Mensaje: 'Ok' });

}

 // ==================================================
//   Lista los clientes inscriptos en un cierto plan
// ==================================================

public async listarClientesPlan(req: Request, res: Response): Promise<void> {

     var IdPlan = req.params.IdPlan || 0;
     IdPlan  = Number(IdPlan);

     var desde = req.params.desde || 0;
     desde  = Number(desde);

     const clientes = await pool.query('call bsp_listar_clientes_plan(?,?)',[desde,IdPlan]);

     res.json(clientes);
 }

// ===========================================================================
// =========================== PROFESIONALES ==========================================
// ===========================================================================


// ==================================================
//        Inserta un profesional
// ==================================================


public async createProfesional(req: Request, res: Response) {

    var IdTipoDocumento = req.body.IdTipoDocumento;
    var Apellidos = req.body.Apellidos;
    var Nombres = req.body.Nombres;
    var Documento = req.body.Documento;
    var Password = req.body.Password;
    var Telefono = req.body.Telefono;
    var Sexo = req.body.Sexo;
    var Observaciones = req.body.Observaciones;
    var FechaNac = req.body.FechaNac;
    var Correo = req.body.Correo;
    var Usuario = req.body.Usuario;
    var Calle = req.body.Calle;
    var Piso = req.body.Piso;
    var Departamento = req.body.Departamento;
    var Ciudad = req.body.Ciudad;
    var Pais = req.body.Pais;
    var Numero = req.body.Numero;    // 19
    var IdRol = req.body.IdRol; 

    const result = await pool.query('CALL bsp_alta_profesional(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
     [IdTipoDocumento,IdRol,Apellidos,Nombres,Documento,Password,Telefono,Sexo,Observaciones,FechaNac,
        Correo,Usuario,Calle,Piso,Departamento,Ciudad,Pais,Numero]);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            Mensaje: result[0][0].Mensaje
        });
    }

    res.json({ Mensaje: 'Ok' });

}


// ==================================================
//        Actualiza un profesional
// ==================================================


public async actualizaProfesional(req: Request, res: Response) {

    console.log("req.body en actualizaProfesional es : ", req.body);

    var IdPersona = req.body.IdPersona;
    var IdTipoDocumento = req.body.IdTipoDocumento;
    var Apellidos = req.body.Apellidos;
    var Nombres = req.body.Nombres;
    var Documento = req.body.Documento;
    // var Password = bcrypt.hashSync(req.body.Password,10);         // Encriptacion de una sola via
    var Password = req.body.Password;
    var Telefono = req.body.Telefono;
    var Sexo = req.body.Sexo;
    var Observaciones = req.body.Observaciones;
    var IdRol = req.body.IdRol;
    var FechaNac = req.body.FechaNac;
    var Correo = req.body.Correo;
    var Usuario = req.body.Usuario;
    var Calle = req.body.Calle;
    var Piso = req.body.Piso;
    var Departamento = req.body.Departamento;
    var Ciudad = req.body.Ciudad;
    var Pais = req.body.Pais;
    var Numero = req.body.Numero;    // 20
    var Estado = req.body.Estado; 

    const result = await pool.query('CALL bsp_actualiza_profesional(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
    [IdPersona,IdTipoDocumento,IdRol,Apellidos,Nombres,Documento,Password,Telefono,Sexo,Observaciones,FechaNac,Correo,Usuario,Calle,Piso,Departamento,Ciudad,Pais,Numero,Estado]);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            // ok: false,
            Mensaje: result[0][0].Mensaje
        });
    }

    return res.json({ Mensaje: 'Ok' });

}

// ==================================================
//   Da de baja un profesional
// ==================================================

public async darBajaProfesional(req: Request, res: Response) {

    var IdPersona = req.params.IdPersona;

    const result = await pool.query('CALL bsp_darbaja_profesional(?)',IdPersona);

    if(result[0][0].Mensaje !== 'Ok'){
        return res.json({
            ok: false,
            mensaje: result.Mensaje
        });
    }
    return res.json({ mensaje: 'Ok' });

}
 // ==================================================
//        Lista el personal del gimnasio desde cierto valor
// ==================================================

public async listarPersonal(req: Request, res: Response): Promise<void> {

     var desde =  req.params.desde;
     var incluyeBajas =  req.params.incluyeBajas;

     const personal = await pool.query('call bsp_listar_personal(?,?)',[desde,incluyeBajas]);

     res.json(personal);
 }

 // ==================================================
//        Lista el personal del gimnasio desde cierto valor
//       Si en pDesde viene '-1' entonces se listan todos los profesionales
// ==================================================

public async listarProfesionales(req: Request, res: Response): Promise<void> {

     const personal = await pool.query('call bsp_listar_profesionales()');

     res.json(personal);
 }
}


const personasController = new PersonasController;
export default personasController;