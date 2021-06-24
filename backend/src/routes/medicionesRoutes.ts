import express, { Router } from 'express';

 var mdAutenticacion = require('../middlewares/autenticacion');

import medicionesController from '../controllers/medicionesController';

class MedicionesRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {

        this.router.get('/:IdMedicion',[mdAutenticacion.verificaToken,mdAutenticacion.verificaProfesionalAdmin], medicionesController.getOne);
        this.router.get('/listar/:id/:desde',mdAutenticacion.verificaToken, medicionesController.listarMediciones);
        this.router.post('/', [mdAutenticacion.verificaToken,mdAutenticacion.verificaProfesionalAdmin], medicionesController.nuevaMedicion);
        this.router.put('/actualizar', [mdAutenticacion.verificaToken,mdAutenticacion.verificaProfesionalAdmin], medicionesController.actualizarMedicion);
        this.router.delete('/eliminar/:id', [mdAutenticacion.verificaToken,mdAutenticacion.verificaProfesionalAdmin], medicionesController.eliminarMedicion);


    }

}

const medicionesRoutes = new MedicionesRoutes();
export default medicionesRoutes.router;