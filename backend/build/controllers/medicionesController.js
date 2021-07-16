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
var database_1 = __importDefault(require("../database"));
var MedicionesController = /** @class */ (function () {
    function MedicionesController() {
    }
    // ==================================================
    //        Lista las mediciones dado un cliente
    // ==================================================
    MedicionesController.prototype.listarMediciones = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, desde, mediciones;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body en listarMediciones ', req.body);
                        console.log(' req.params en listarMediciones ', req.params);
                        console.log(' req.params.id en listarMediciones ', req.params.id);
                        console.log(' req.params.desde en listarMediciones ', req.params.desde);
                        id = req.params.id;
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_mediciones(?,?)', [desde, id])];
                    case 1:
                        mediciones = _a.sent();
                        console.log('mediciones en medicionesCOntroleer es : ', mediciones);
                        res.json(mediciones);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Inserta una medicion
    // ==================================================
    MedicionesController.prototype.nuevaMedicion = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, IdProfesional, Altura, Peso, IMC, Musc, Grasa, GV, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en nuevaMedicion.ts es : ", req.body);
                        IdPersona = req.body.IdCliente;
                        IdProfesional = req.body.IdProfesional;
                        Altura = req.body.Altura;
                        Peso = req.body.Peso;
                        IMC = req.body.IMC;
                        Musc = req.body.Musc;
                        Grasa = req.body.Grasa;
                        GV = req.body.GV;
                        console.log("Altura en personasCntrolles.ts es : ", Altura);
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_medicion(?,?,?,?,?,?,?,?)', [IdPersona, IdProfesional, Altura, Peso, IMC, Musc, Grasa, GV])];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui y result es : ", result);
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    // ok: false,
                                    Mensaje: result[0][0].Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en nuevaMedicion  y result es : ", result);
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Obtiene una medicion de la BD
    // ==================================================
    MedicionesController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdMedicion, medicion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdMedicion = req.params.IdMedicion;
                        console.log('id en medicionesController : ', IdMedicion);
                        return [4 /*yield*/, database_1["default"].query('call bsp_dame_medicion(?)', IdMedicion)];
                    case 1:
                        medicion = _a.sent();
                        console.log('medicion es : ', medicion);
                        if (medicion[1][0].Mensaje === 'Ok') {
                            return [2 /*return*/, res.json(medicion[0][0])];
                        }
                        res.status(404).json({ text: medicion[1][0].Mensaje });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Editar una medicion de la BD
    // ==================================================
    MedicionesController.prototype.actualizarMedicion = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Altura, Peso, IMC, Musc, Grasa, GV, IdProfesional, IdMedicion, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en actualizarMedicion es : ", req.body);
                        Altura = req.body.Altura;
                        Peso = req.body.Peso;
                        IMC = req.body.IMC;
                        Musc = req.body.Musc;
                        Grasa = req.body.Grasa;
                        GV = req.body.GV;
                        IdProfesional = req.body.IdProfesional;
                        IdMedicion = req.body.IdMedicion;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_actualiza_medicion(?,?,?,?,?,?,?,?)', [IdMedicion, IdProfesional, Altura, Peso, IMC, Musc, Grasa, GV])];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui en actualizarMedicion y result es : ", result);
                        console.log("Ingreso hasta aqui en actualizarMedicion y result[0][0].Mensaje es : ", result[0][0].Mensaje);
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    mensaje: result[0][0].Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en actualizarMedicion  y result es : ", result);
                        res.json({ message: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //   Elimina una medicion
    // ==================================================
    MedicionesController.prototype.eliminarMedicion = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdMedicion, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en eliminarMedicion es : ", req.params);
                        IdMedicion = req.params.id;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_eliminar_medicion(?)', IdMedicion)];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui en eliminarMedicion y result : ", result);
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    Mensaje: result.Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en eliminarMedicion y result es : ", result);
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    return MedicionesController;
}());
var medicionesController = new MedicionesController;
exports["default"] = medicionesController;
