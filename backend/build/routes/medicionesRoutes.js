"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
var medicionesController_1 = __importDefault(require("../controllers/medicionesController"));
var MedicionesRoutes = /** @class */ (function () {
    function MedicionesRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    MedicionesRoutes.prototype.config = function () {
        this.router.get('/:IdMedicion', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], medicionesController_1["default"].getOne);
        this.router.get('/listar/:id/:desde', mdAutenticacion.verificaToken, medicionesController_1["default"].listarMediciones);
        this.router.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], medicionesController_1["default"].nuevaMedicion);
        this.router.put('/actualizar', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], medicionesController_1["default"].actualizarMedicion);
        this.router["delete"]('/eliminar/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], medicionesController_1["default"].eliminarMedicion);
    };
    return MedicionesRoutes;
}());
var medicionesRoutes = new MedicionesRoutes();
exports["default"] = medicionesRoutes.router;
