"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var mdAutenticacion = require('../middlewares/autenticacion');
var personasController_1 = __importDefault(require("../controllers/personasController"));
var PersonasRoutes = /** @class */ (function () {
    function PersonasRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    PersonasRoutes.prototype.config = function () {
        this.router.get('/', mdAutenticacion.verificaToken, personasController_1["default"].list);
        this.router.get('/roles/listar', personasController_1["default"].listarRoles); // ,mdAutenticacion.verificaAdmin 
        // Clientes
        this.router.get('/clientes/:desde', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].listarClientes);
        this.router["delete"]('/cliente/eliminar/:IdPersona', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].eliminarCliente); // Actualiza
        this.router.put('/cliente/actualizar/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].actualizaCliente); // Actualiza se quito esto , 13/03/20 --> 
        this.router.post('/cliente', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].createCliente); // Se quito la autenticacion con token para esto
        this.router.get('/clientes/plan/:desde/:IdPlan', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].listarClientesPlan); // ,mdAutenticacion.verificaAdmin 
        this.router.put('/cliente/activar/:IdPersona', [mdAutenticacion.verificaToken, mdAutenticacion.verificaProfesionalAdmin], personasController_1["default"].activarCliente); // Actualiza se quito esto , 13/03/20 --> 
        // Profesionales
        this.router.get('/profesionales/:desde', mdAutenticacion.verificaAdmin, personasController_1["default"].listarProfesionales);
        this.router.get('/profesionales', personasController_1["default"].listarProfesionales);
        this.router["delete"]('/profesional/eliminar/:IdPersona', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], personasController_1["default"].darBajaProfesional);
        this.router.get('/personal/listar/:desde/:incluyeBajas', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], personasController_1["default"].listarPersonal);
        this.router.put('/profesional/actualizar/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], personasController_1["default"].actualizaProfesional); // Actualiza se quito esto , 13/03/20 --> 
        this.router.post('/profesional', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], personasController_1["default"].createProfesional); // Se quito la autenticacion con token para esto
        // ...
        this.router.get('/:id', personasController_1["default"].getOne);
        this.router.get('/busqueda/:busqueda', personasController_1["default"].buscar);
        this.router.get('/busqueda/plan/:Apellido/:Nombre/:IdPlan', personasController_1["default"].buscarPorPlanEstado);
        // this.router.get('/busqueda/plan/:Apellido/:Nombre/:IdPlan/:Estado', personasController.buscarPorPlanEstado);
    };
    return PersonasRoutes;
}());
var personasRoutes = new PersonasRoutes();
exports["default"] = personasRoutes.router;
