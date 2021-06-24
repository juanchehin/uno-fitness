import { Request, Response } from 'express';


import pool from '../database';

// ==================================================
//        Lista los tipos de documento de la BD
// ==================================================

class TiposDocumentosController {

    public async list(req: Request, res: Response): Promise<void> {
        const tiposDocumentos = await pool.query('call bsp_listar_tipodocumento()');
        res.json(tiposDocumentos);
    }

// ==================================================
//        Obtiene un tipo de documento de la BD
// ==================================================


public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const tipodoc = await pool.query('call bsp_dame_tipodocumento(?)', [id]);

    if (tipodoc.length > 0) {
        return res.json(tipodoc[0]);
    }
    res.status(404).json({ text: "El tipoDoc no existe" });
}

// ==================================================
//        Inserta un tipo de documento
// ==================================================


public async create(req: Request, res: Response): Promise<any> {
        
    // var sql = "SET @Documento = '" + req.body.Documento + "';SET @Descripcion = '" + req.body.Documento + "'; \
    // CALL bsp_alta_tipodocumento(@Documento,@Descripcion);"

    // console.log('sql es : ',sql);

    //console.log('req.body.Documento es : ',req.body.Documento);

    // const result = pool.query;

    // console.log('result es : ',result);

    /* con.query(sql, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
    }); */

    /*console.log('req.body es : ',req.body)

    console.log('documento es : ',req.body.Documento)

    console.log('Descripcion es : ',req.body.Descripcion)*/

    var documento = req.body.Documento;
    var descripcion = req.body.Descripcion;

    const result = await pool.query('CALL bsp_alta_tipodocumento(?,?)', [documento,descripcion] );

    // const result = pool.query('SET @Documento = "Nuevodoc2";SET @Descripcion = "Esto es una descripcion nueva";CALL bsp_alta_tipodocumento(@Documento,@Descripcion);');

    console.log('result es : ',result);
    res.json({ message: 'TipoDoc guardada' });
}

 /*   public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const games = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
        console.log(games.length);
        if (games.length > 0) {
            return res.json(games[0]);
        }
        res.status(404).json({ text: "The game doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO games set ?', [req.body]);
        res.json({ message: 'Game Saved' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldGame = req.body;
        await pool.query('UPDATE games set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "The game was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM games WHERE id = ?', [id]);
        res.json({ message: "The game was deleted" });
    } */
}

const tiposdocumentosController = new TiposDocumentosController;
export default tiposdocumentosController;