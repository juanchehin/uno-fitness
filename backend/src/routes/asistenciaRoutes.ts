import express, { Router } from 'express';

var mdAutenticacion = require('../middlewares/autenticacion');

import asistenciaController from '../controllers/asistenciaController';

class AsistenciaRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',mdAutenticacion.verificaToken, asistenciaController.getOne);
        this.router.get('/cliente/:IdPersona',mdAutenticacion.verificaToken, asistenciaController.marcarAsistenciaPersona);
        this.router.get('/:desde/:IdPersona',mdAutenticacion.verificaToken, asistenciaController.listarAsistencias);

    }

}

const asistenciaRoutes = new AsistenciaRoutes();
export default asistenciaRoutes.router;