"use strict";
// Creo que esta clase deberia ser eliminada 17/03/20
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var tiposdocumentosController_1 = __importDefault(require("../controllers/tiposdocumentosController"));
var TiposDocumentosRoutes = /** @class */ (function () {
    function TiposDocumentosRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    TiposDocumentosRoutes.prototype.config = function () {
        this.router.get('/', tiposdocumentosController_1["default"].list);
        this.router.get('/:id', tiposdocumentosController_1["default"].getOne);
        this.router.post('/', tiposdocumentosController_1["default"].create);
    };
    return TiposDocumentosRoutes;
}());
var tiposdocumentosController = new TiposDocumentosRoutes();
exports["default"] = tiposdocumentosController.router;
