"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fileUpload = require('express-fileupload');
// const cors = require("cors");
var fs = require('fs');
var database_1 = __importDefault(require("../database"));
var path = require('path');
// var bcrypt = require('bcryptjs');
var CajaController = /** @class */ (function () {
    function CajaController() {
    }
    // ==================================================
    //  Lista los movimientos de un cierto cliente
    // ==================================================
    CajaController.prototype.dameMovimientosClientes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, desde, movimientos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.id;
                        desde = req.query.desde;
                        return [4 /*yield*/, database_1["default"].query('call bsp_movimientos_cliente(?,?)', [id, desde])];
                    case 1:
                        movimientos = _a.sent();
                        console.log('movimientos es : ', movimientos);
                        res.json(movimientos);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Lista las transacciones
    // ==================================================
    CajaController.prototype.list = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, FechaInicio, FechaFin, transacciones;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body en caja listar transacciones es ', req.body);
                        console.log('req.params en caja listar transacciones es ', req.params);
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        FechaInicio = req.params.FechaInicio;
                        FechaFin = req.params.FechaFin;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_transacciones(?,?,?)', [desde, FechaInicio, FechaFin])];
                    case 1:
                        transacciones = _a.sent();
                        console.log('transacciones despues de la carga es personasCOntroleer es : ', transacciones);
                        res.json(transacciones);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ======================================================================================================================
    // ================================= INGRESOS ==========================================================================
    // ======================================================================================================================
    // ==================================================
    //        Lista los ingresos
    // ==================================================
    CajaController.prototype.listarIngresos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, FechaInicio, FechaFin, ingresos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        FechaInicio = req.params.FechaInicio;
                        FechaFin = req.params.FechaFin;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_ingresos(?,?,?)', [desde, FechaInicio, FechaFin])];
                    case 1:
                        ingresos = _a.sent();
                        console.log('ingresos despues de la carga es ingresos personasCOntroleer es : ', ingresos);
                        res.json(ingresos);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Inserta un ingreso
    // ==================================================
    CajaController.prototype.createIngreso = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var pIdPersona, pIdPlan, pCantidad, pDescripcion, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en createIngreso.ts es : ", req.body);
                        pIdPersona = req.body.IdPersona;
                        pIdPlan = req.body.IdPlan;
                        pCantidad = req.body.Cantidad;
                        pDescripcion = req.body.Detalle;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_ingreso(?,?,?,?)', [pIdPersona, pIdPlan, pCantidad, pDescripcion])];
                    case 1:
                        result = _a.sent();
                        console.log("result en createIngreso.ts es : ", result);
                        console.log("result[0][0].Mensaje en createIngreso.ts es : ", result[0][0].Mensaje);
                        if (result[0][0].Mensaje !== 'Ok') {
                            res.json({ message: result[0][0].Mensaje });
                            console.log("Error en la transaccion ");
                            return [2 /*return*/];
                        }
                        console.log("No hay Error en la transaccion  ");
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===========================================================================================================
    // ================================ EGRESOS =================================================================
    // ===========================================================================================================
    // ==================================================
    //        Lista los egresos - HACER PARA QUE SEA ENTRE FECHAS
    // ==================================================
    CajaController.prototype.listarEgresos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, FechaInicio, FechaFin, egresos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body en caja listar egresos es ', req.body);
                        desde = req.query.desde || 0;
                        desde = Number(desde);
                        FechaInicio = req.params.FechaInicio;
                        FechaFin = req.params.FechaFin;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_egresos(?,?,?)', [desde, FechaInicio, FechaFin])];
                    case 1:
                        egresos = _a.sent();
                        console.log('egresos despues de la carga es egresos personasCOntroleer es : ', egresos);
                        res.json(egresos);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Inserta un egreso
    // ==================================================
    CajaController.prototype.createEgreso = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Monto, Cantidad, Detalle, pIdPersona, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req en createEgreso.ts es : ", req.body);
                        Monto = req.body.Monto;
                        Cantidad = req.body.Cantidad;
                        Detalle = req.body.Detalle;
                        pIdPersona = req.body.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_egreso(?,?,?,?)', [Monto, pIdPersona, Cantidad, Detalle])];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui y result en caja es : ", result);
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    return CajaController;
}());
var cajaController = new CajaController;
exports["default"] = cajaController;
