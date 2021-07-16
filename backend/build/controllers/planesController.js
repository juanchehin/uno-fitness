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
var PlanesController = /** @class */ (function () {
    function PlanesController() {
    }
    // ==================================================
    //       Marca la asistencia de un cliente
    // ==================================================
    PlanesController.prototype.marcarAsistencia = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, planes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, database_1["default"].query('call bsp_marcarAsistencia(?)', id)];
                    case 1:
                        planes = _a.sent();
                        // console.log('todas las planes en damePlanCliente es : ', planes);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(planes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //    Lista el plan activo de un cliente
    // ==================================================
    PlanesController.prototype.damePlanCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, planes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, database_1["default"].query('call bsp_dame_plan_cliente(?)', id)];
                    case 1:
                        planes = _a.sent();
                        // console.log('todas las planes en damePlanCliente es : ', planes);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(planes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Lista planes desde cierto valor
    // ==================================================
    PlanesController.prototype.list = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, incluyeBajas, planes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        incluyeBajas = req.params.incluyeBajas || 0;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_planes(?,?)', [desde, incluyeBajas])];
                    case 1:
                        planes = _a.sent();
                        // console.log('planes en list es : ', planes);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(planes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Lista todos los planes
    // ==================================================
    PlanesController.prototype.listAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var planes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].query('call bsp_listar_todos_planes()')];
                    case 1:
                        planes = _a.sent();
                        // console.log('todas las planes en planesCOntroleer es : ', planes);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(planes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Obtiene un plan de la BD
    // ==================================================
    PlanesController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, planes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, database_1["default"].query('call bsp_dame_plan(?)', [id])];
                    case 1:
                        planes = _a.sent();
                        // console.log('planes es : ',planes);
                        if (planes[0][0].Mensaje !== 'El Plan no existe!') {
                            return [2 /*return*/, res.json(planes[0])];
                        }
                        res.status(404).json({ text: "El plan no existe" });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Inserta un plan
    // ==================================================
    PlanesController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var CantClases, Plan, Precio, Descripcion, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        CantClases = req.body.CantClases;
                        Plan = req.body.Plan;
                        Precio = req.body.Precio;
                        Descripcion = req.body.Descripcion;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_plan(?,?,?,?)', [Plan, Precio, Descripcion, CantClases])];
                    case 1:
                        result = _a.sent();
                        // console.log("Ingreso hasta aqui y result es : ",result);
                        // const result = pool.query("CALL bsp_alta_persona(" + req.body.IdRol + "','" + req.body.IdTipoDocumento + "','" + req.body.Apellido + "','" + req.body.Nombre + "','" + req.body.Documento + "','" + req.body.Password + "','" + req.body.Telefono + "','" + req.body.Sexo + "','" + req.body.Observaciones + "','" + req.body.Foto + "','" + req.body.FechaNac + "','" + req.body.Correo + "','" + req.body.Usuario + "','" + req.body.Calle + "','" + req.body.Piso + "','" + req.body.Departamento + "','" + req.body.Ciudad + "','" + req.body.Pais + "','" + req.body.Numero + ")");
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Actualiza un plan
    // ==================================================
    PlanesController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var pIdPlan, pPlan, pPrecio, pCantClases, pDescripcion, pEstado, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pIdPlan = req.params.IdPlan;
                        pPlan = req.body.Plan;
                        pPrecio = req.body.Precio;
                        pCantClases = req.body.CantClases;
                        pDescripcion = req.body.Descripcion;
                        pEstado = req.body.EstadoPlan;
                        return [4 /*yield*/, database_1["default"].query('call bsp_modifica_plan(?,?,?,?,?,?)', [pIdPlan, pPlan, pPrecio, pCantClases, pDescripcion, pEstado])];
                    case 1:
                        result = _a.sent();
                        // console.log('result en update plan es ', result);
                        if (result[0][0].Mensaje !== 'Ok') {
                            res.json({ Mensaje: result[0][0].Mensaje });
                            console.log("Error en la transaccion ");
                            return [2 /*return*/];
                        }
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Da de baja un plan
    // ==================================================
    PlanesController.prototype.baja = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_darbaja_plan(?)', id)];
                    case 1:
                        result = _a.sent();
                        // console.log('Result es  : ', result[0][0].Mensaje);
                        if (result[0][0].Mensaje !== 'Ok') {
                            res.json({ Mensaje: result[0][0].Mensaje });
                        }
                        else {
                            res.json(result[0][0].Mensaje);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlanesController;
}());
var planesController = new PlanesController;
exports["default"] = planesController;
