// Creo que esta clase deberia ser eliminada 17/03/20

import express, { Router } from 'express';

import TiposDocumentosController from '../controllers/tiposdocumentosController';

class TiposDocumentosRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', TiposDocumentosController.list);
        this.router.get('/:id', TiposDocumentosController.getOne);
        this.router.post('/', TiposDocumentosController.create);
    }

}

const tiposdocumentosController = new TiposDocumentosRoutes();
export default tiposdocumentosController.router;