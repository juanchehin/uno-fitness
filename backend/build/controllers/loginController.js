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
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var database_1 = __importDefault(require("../database"));
var LoginController = /** @class */ (function () {
    function LoginController() {
    }
    // ========================================================
    //                    LOGUEO
    // ========================================================
    LoginController.prototype.log = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, user, result, token, respuesta, menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        menu = [];
                        console.log('body es ', body);
                        console.log('ingresa logincontroller , ahora va el token');
                        user = body.Correo;
                        return [4 /*yield*/, database_1["default"].query("call bsp_dame_persona_correo_pass(?,?)", [body.Correo, body.Password])];
                    case 1:
                        result = _a.sent();
                        if (result[0][0].Mensaje !== 'Ok' || null) {
                            console.log('Error de credenciales');
                            // Quitar esto para produccion
                            res.json({
                                ok: true,
                                mensaje: 'Error de credenciales'
                                // token: token,
                                // id: IdPersona
                                // body: body
                            });
                            return [2 /*return*/];
                        }
                        console.log('USUARIO Y CONTRASEÑA CORRECTOS');
                        token = jwt.sign({ usuario: body.correo }, SEED, { expiresIn: 14400 });
                        // var menu = this.obtenerMenu(result[0][0].IdRol)
                        console.log('result[0][0].IdRol ', result[0][0].IdRol);
                        if (!(result[0][0].IdRol === 1)) return [3 /*break*/, 3];
                        console.log('Entro en el IDROL 1 ');
                        menu = [
                            // titulo: 'Principal',
                            // icono: 'mdi mdi-gauge',
                            // submenu: [
                            // { titulo: 'principal', url: '/principal' , icono :'signal_cellular_alt'},
                            { titulo: 'Mis mediciones', url: '/cliente/mediciones', icono: 'format_list_bulleted' },
                            { titulo: 'Mis asistencias', url: '/cliente/asistencias', icono: 'assignment_turned_in' },
                            { titulo: 'Mis graficas', url: '/cliente/graficas', icono: 'insert_chart_outlined' }
                            // { titulo: 'Promesas', url: '/promesas' },
                            // { titulo: 'RxJs', url: '/rxjs' }
                        ];
                        // Se ejecuta una actualizacion de cliente cada vez que accede de forma exitosa, verifica la cantidad de clases
                        // su estado , si tiene meses de credito , etc
                        console.log('Justo antes de actualiza estado cliente y IdPeronsa es ', result[0][0].IdPersona);
                        return [4 /*yield*/, database_1["default"].query('call bsp_actualiza_estado_cliente(?)', result[0][0].IdPersona)];
                    case 2:
                        respuesta = _a.sent();
                        console.log('respuesta es await', respuesta);
                        _a.label = 3;
                    case 3:
                        // ==========================================
                        //  IdRol 2 - Profesionales
                        // ==========================================
                        if (result[0][0].IdRol === 2) {
                            console.log('Entro en el IDROL 2 ');
                            menu = [
                                // titulo: 'Principal',
                                // icono: 'mdi mdi-gauge',
                                // submenu: [
                                // { titulo: 'Profesionales', url: '/mantenimiento/profesionales', icono :'sports_kabaddi' },
                                { titulo: 'Clientes', url: '/mantenimiento/clientes', icono: 'group' },
                                { titulo: 'Caja', url: '/cajas', icono: 'attach_money' },
                            ];
                        }
                        // ];
                        // ==========================================
                        //  IdRol 3 - Administrador
                        // ==========================================
                        if (result[0][0].IdRol === 3) {
                            console.log('Entro en el IDROL 3 ');
                            menu = [
                                // titulo: 'Principal',
                                // icono: 'mdi mdi-gauge',
                                // submenu: [
                                { titulo: 'Personal', url: '/mantenimiento/profesionales', icono: 'group' },
                                { titulo: 'Clientes', url: '/mantenimiento/clientes', icono: 'sports_kabaddi' },
                                { titulo: 'Caja', url: '/cajas', icono: 'attach_money' },
                                { titulo: 'Planes', url: '/mantenimiento/planes', icono: 'dehaze' }
                            ];
                        }
                        res.status(200).json({
                            ok: true,
                            usuario: result[0][0].correo,
                            IdRol: result[0][0].IdRol,
                            token: token,
                            id: result[0][0].IdPersona,
                            menu: menu
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    //  Renueva TOKEN
    // ==========================================
    LoginController.prototype.renuevatoken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, token;
            return __generator(this, function (_a) {
                body = req.body;
                token = jwt.sign({ usuario: body.correo }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    token: token
                });
                return [2 /*return*/];
            });
        });
    };
    // ==================================================
    //   Actualiza el estado de un cliente
    // ==================================================
    LoginController.prototype.actualizaEstadoCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, respuesta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(' req.params en actualizaEstadoCliente ', req.params);
                        IdPersona = req.params.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('call bsp_actualiza_estado_cliente(?)', IdPersona)];
                    case 1:
                        respuesta = _a.sent();
                        console.log('respuesta en actualizaEstadoCliente es : ', respuesta);
                        res.json(respuesta);
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginController;
}());
var loginController = new LoginController;
exports["default"] = loginController;
