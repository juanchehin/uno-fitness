"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
var asistenciaController_1 = __importDefault(require("../controllers/asistenciaController"));
var AsistenciaRoutes = /** @class */ (function () {
    function AsistenciaRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    AsistenciaRoutes.prototype.config = function () {
        this.router.get('/', mdAutenticacion.verificaToken, asistenciaController_1["default"].getOne);
        this.router.get('/cliente/:IdPersona', mdAutenticacion.verificaToken, asistenciaController_1["default"].marcarAsistenciaPersona);
        this.router.get('/:desde/:IdPersona', mdAutenticacion.verificaToken, asistenciaController_1["default"].listarAsistencias);
    };
    return AsistenciaRoutes;
}());
var asistenciaRoutes = new AsistenciaRoutes();
exports["default"] = asistenciaRoutes.router;
