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
var AsistenciaController = /** @class */ (function () {
    function AsistenciaController() {
    }
    // ==================================================
    //        Inserta una asistencia
    // ==================================================
    AsistenciaController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, IdProfesional, Altura, Peso, IMC, Musc, Grasa, GV, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en medicionesCntrolles.ts es : ", req.body);
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
                        res.json({ message: 'Medicion guardada' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //  Lista las asistencias desde cierto valor y dado un IdPersona
    // ==================================================
    AsistenciaController.prototype.listarAsistencias = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, IdPersona, asistencias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        IdPersona = req.params.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_asistencias_cliente(?,?)', [desde, IdPersona])];
                    case 1:
                        asistencias = _a.sent();
                        console.log('asistencias en personasCOntroleer es : ', asistencias);
                        res.json(asistencias);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Obtiene una asistencia de la BD
    // ==================================================
    AsistenciaController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, asistencia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        console.log('id en AsistenciaController : ', id);
                        return [4 /*yield*/, database_1["default"].query('call bsp_dame_total_asistencia(?)', [id])];
                    case 1:
                        asistencia = _a.sent();
                        console.log('asistencia es : ', asistencia);
                        if (asistencia[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    // ok: false,
                                    Mensaje: asistencia.Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en asistencia y asistencia es : ", asistencia);
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //  Marca la asistencia dado un IdPersona y un IdPlan
    // ==================================================
    AsistenciaController.prototype.marcarAsistenciaPersona = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, asistencia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdPersona = req.params.IdPersona;
                        // const IdPlan = req.params.IdPlan;
                        console.log('IdPersona en marcarAsistenciaPersona : ', IdPersona);
                        return [4 /*yield*/, database_1["default"].query('call bsp_marcar_asistencia(?)', IdPersona)];
                    case 1:
                        asistencia = _a.sent();
                        console.log('asistencia marcarAsistenciaPersona es : ', asistencia);
                        if (asistencia[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    // ok: false,
                                    Mensaje: asistencia.Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en asistencia y asistencia es : ", asistencia);
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    return AsistenciaController;
}());
var asistenciaController = new AsistenciaController;
exports["default"] = asistenciaController;
