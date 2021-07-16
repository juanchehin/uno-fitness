"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
var cajaController_1 = __importDefault(require("../controllers/cajaController"));
var CajaRoutes = /** @class */ (function () {
    function CajaRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    CajaRoutes.prototype.config = function () {
        this.router.get('/:desde/:FechaInicio/:FechaFin', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], cajaController_1["default"].list);
        this.router.post('/egresos', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], cajaController_1["default"].createEgreso);
        this.router.get('/egresos/listar/:desde/:FechaInicio/:FechaFin', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], cajaController_1["default"].listarEgresos);
        this.router.post('/ingresos', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], cajaController_1["default"].createIngreso);
        this.router.get('/ingresos/listar/:desde/:FechaInicio/:FechaFin', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], cajaController_1["default"].listarIngresos);
        this.router.get('/cliente/:id', cajaController_1["default"].dameMovimientosClientes);
    };
    return CajaRoutes;
}());
var cajaRoutes = new CajaRoutes();
exports["default"] = cajaRoutes.router;
