"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
var planesController_1 = __importDefault(require("../controllers/planesController"));
var PlanesRoutes = /** @class */ (function () {
    function PlanesRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    PlanesRoutes.prototype.config = function () {
        this.router.get('/listar/:desde/:incluyeBajas', planesController_1["default"].list);
        this.router.get('/cliente/:id', mdAutenticacion.verificaToken, planesController_1["default"].damePlanCliente);
        this.router.get('/todas', planesController_1["default"].listAll);
        this.router.get('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], planesController_1["default"].getOne);
        this.router.put('/baja/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], planesController_1["default"].baja);
        this.router.put('/actualiza/:IdPlan', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], planesController_1["default"].update); // Actualiza
        this.router.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], planesController_1["default"].create); // Se quito la autenticacion con token para esto - 28/12/19
    };
    return PlanesRoutes;
}());
var planesRoutes = new PlanesRoutes();
exports["default"] = planesRoutes.router;
