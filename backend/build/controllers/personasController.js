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
var path = require('path');
var PersonasController = /** @class */ (function () {
    function PersonasController() {
    }
    // ==================================================
    //        Lista los roles del sistema
    // ==================================================
    PersonasController.prototype.listarRoles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body en listarRoles ', req.body);
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_roles()')];
                    case 1:
                        roles = _a.sent();
                        console.log('roles en listarRoles ', roles);
                        res.json(roles);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Lista personas desde cierto valor
    // ==================================================
    PersonasController.prototype.list = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, personas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body es ', req.body);
                        desde = req.query.desde || 0;
                        desde = Number(desde);
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_personas(?)', [desde])];
                    case 1:
                        personas = _a.sent();
                        // console.log('Personas en personasCOntroleer es : ', personas);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(personas);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Obtiene una personas de la BD
    // ==================================================
    PersonasController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, personas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        console.log('Entro en getOne y el req.params es : ', req.params);
                        return [4 /*yield*/, database_1["default"].query('call bsp_dame_persona(?)', [id])];
                    case 1:
                        personas = _a.sent();
                        console.log('personas es : ', personas);
                        if (personas[0][0].Mensaje !== 'La persona no existe!') {
                            return [2 /*return*/, res.json(personas[0])];
                        }
                        res.status(404).json({ text: "La personas no existe" });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Busqueda por nombre - apellido , filtra por plan y si incluye a los clientes dados de baja o no
    // ==================================================
    PersonasController.prototype.buscarPorPlanEstado = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Apellido, Nombre, IdPlan, clientes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Apellido = req.params.Apellido;
                        Nombre = req.params.Nombre;
                        IdPlan = req.params.IdPlan;
                        // const Estado = req.params.Estado;
                        if (Apellido === 'null')
                            Apellido = '';
                        if (Nombre === 'null')
                            Nombre = '';
                        console.log("req.params es buscarPorPlanEstado : ", req.params);
                        console.log("Nombre es buscarPorPlanEstado : ", Nombre);
                        console.log("Apellido es buscarPorPlanEstado : ", Apellido);
                        return [4 /*yield*/, database_1["default"].query('call bsp_buscar_cliente_plan_estado(?,?,?)', [Apellido, Nombre, IdPlan])];
                    case 1:
                        clientes = _a.sent();
                        console.log("personas buscarPorPlanEstado es : ", clientes);
                        res.json(clientes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Busqueda por nombre - apellido
    // ==================================================
    PersonasController.prototype.buscar = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var busqueda, personas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        busqueda = req.params.busqueda;
                        console.log("busqueda es : ", busqueda);
                        return [4 /*yield*/, database_1["default"].query('call bsp_buscar_persona(?)', busqueda)];
                    case 1:
                        personas = _a.sent();
                        console.log("personas es : ", personas);
                        res.json(personas);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Actualiza una persona
    // ==================================================
    PersonasController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        // const ViejaPersona = req.body;
                        // const result = pool.query("CALL bsp_alta_persona(" + req.body.IdRol + "','" + req.body.IdTipoDocumento + "','" + req.body.Apellido + "','" + req.body.Nombre + "','" + req.body.Documento + "','" + req.body.Password + "','" + req.body.Telefono + "','" + req.body.Sexo + "','" + req.body.Observaciones + "','" + req.body.Foto + "','" + req.body.FechaNac + "','" + req.body.Correo + "','" + req.body.Usuario + "','" + req.body.Calle + "','" + req.body.Piso + "','" + req.body.Departamento + "','" + req.body.Ciudad + "','" + req.body.Pais + "','" + req.body.Numero + ")");
                        return [4 /*yield*/, database_1["default"].query('bsp_modifica_persona(?,?)', [req.body, id])];
                    case 1:
                        // const ViejaPersona = req.body;
                        // const result = pool.query("CALL bsp_alta_persona(" + req.body.IdRol + "','" + req.body.IdTipoDocumento + "','" + req.body.Apellido + "','" + req.body.Nombre + "','" + req.body.Documento + "','" + req.body.Password + "','" + req.body.Telefono + "','" + req.body.Sexo + "','" + req.body.Observaciones + "','" + req.body.Foto + "','" + req.body.FechaNac + "','" + req.body.Correo + "','" + req.body.Usuario + "','" + req.body.Calle + "','" + req.body.Piso + "','" + req.body.Departamento + "','" + req.body.Ciudad + "','" + req.body.Pais + "','" + req.body.Numero + ")");
                        _a.sent();
                        res.json({ message: "La persona se actualizo" });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Da de baja una persona
    // ==================================================
    PersonasController.prototype.baja = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.termino;
                        console.log('Id en baja personasController es : ', id);
                        console.log('req.params en baja personasController es : ', req.params);
                        console.log('req.query en baja personasController es : ', req.query);
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_darbaja_persona(?)', [id])];
                    case 1:
                        result = _a.sent();
                        console.log('result en baja personasController es ', result);
                        // await pool.query('DELETE FROM games WHERE id = ?', [id]);
                        res.json({ message: "Persona dada de baja" });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===========================================================================
    // =========================== CLIENTES ==========================================
    // ===========================================================================
    // ==================================================
    //        Inserta un cliente
    // ==================================================
    PersonasController.prototype.createCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdTipoDocumento, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Objetivo, Ocupacion, Horario, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en createCliente es : ", req.body);
                        IdTipoDocumento = req.body.IdTipoDocumento;
                        Apellidos = req.body.Apellidos;
                        Nombres = req.body.Nombres;
                        Documento = req.body.Documento;
                        Password = req.body.Password;
                        Telefono = req.body.Telefono;
                        Sexo = req.body.Sexo;
                        Observaciones = req.body.Observaciones;
                        FechaNac = req.body.FechaNac;
                        Correo = req.body.Correo;
                        Usuario = req.body.Usuario;
                        Calle = req.body.Calle;
                        Piso = req.body.Piso;
                        Departamento = req.body.Departamento;
                        Ciudad = req.body.Ciudad;
                        Pais = req.body.Pais;
                        Numero = req.body.Numero;
                        Objetivo = req.body.Objetivo;
                        Ocupacion = req.body.Ocupacion;
                        Horario = req.body.Horario;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_cliente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [IdTipoDocumento, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Objetivo, Ocupacion, Horario])];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui en createCliente alta y result es : ", result);
                        console.log("Ingreso hasta aqui en createCliente alta y result[0] es : ", result[0]);
                        // console.log("Ingreso hasta aqui en createCliente alta y result[1] es : ",result[1]);
                        // console.log("Ingreso hasta aqui en result[0][0].Mensaje alta y result[0][0].Mensaje es : ",result[0][0]);
                        // console.log("Ingreso hasta aqui en result[1][0].IdPersona alta y result[1] es : ",result[1][0]);
                        // console.log("Ingreso hasta aqui en result[0][0].Mensaje alta y result[0][0].Mensaje es : ",result[0][0].Mensaje);
                        // console.log("Ingreso hasta aqui en result[1][0].IdPersona alta y result[1] es : ",result[1][0].IdPersona);
                        // var IdPersona = Number(result[1][0].IdPersona);
                        // var pIdPersona = JSON.parse(result[1][0].IdPersona);
                        // var pIdPersona = JSON.stringify(result[1][0].IdPersona);
                        // console.log("Ingreso hasta aqui en createCliente alta y result[1][0].IdPersona es : ",result[1][0].IdPersona);
                        if (result[0][0].Mensaje === 'La persona ya se encuentra cargada') {
                            return [2 /*return*/, res.json({
                                    Mensaje: result[0][0].Mensaje,
                                    pIdPersona: result[1][0].IdPersona
                                })];
                        }
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    Mensaje: result[0][0].Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en clientes alta y result es : ", result);
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //   Activa un cliente (caso de ya existencia en la BD)
    // ==================================================
    PersonasController.prototype.activarCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.params en activarCliente es : ", req.params);
                        IdPersona = req.params.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_activar_cliente(?)', IdPersona)];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui en activarCliente y result es : ", result);
                        console.log("Ingreso hasta aqui en activarCliente y result[0][0].Mensaje es : ", result[0][0].Mensaje);
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    mensaje: result[0][0].Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en activarCliente y result es : ", result);
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //        Lista Clientes desde cierto valor
    // ==================================================
    PersonasController.prototype.listarClientes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, clientes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req.body en clientes ', req.body);
                        desde = req.params.desde || 0;
                        // var estado = req.params.estado || 'A';
                        desde = Number(desde);
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_clientes_estado(?)', [desde])];
                    case 1:
                        clientes = _a.sent();
                        console.log('clientes en personasCOntroleer es : ', clientes);
                        // console.log('json(personas) en personasCOntroleer es : ', res.json(personas));
                        res.json(clientes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //   Elimina un cliente de la BD
    // ==================================================
    PersonasController.prototype.eliminarCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en eliminarCliente es : ", req.params);
                        IdPersona = req.params.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_eliminar_cliente(?)', IdPersona)];
                    case 1:
                        result = _a.sent();
                        console.log("Ingreso hasta aqui en eliminarCliente y result : ", result);
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    mensaje: result.Mensaje
                                })];
                        }
                        console.log("Ingreso hasta aqui en eliminarCliente y result es : ", result);
                        return [2 /*return*/, res.json({ mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //        Edita un cliente
    // ==================================================
    PersonasController.prototype.actualizaCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, IdTipoDocumento, Apellido, Nombre, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Objetivo, Ocupacion, Horario, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdPersona = req.body.IdPersona;
                        IdTipoDocumento = req.body.IdTipoDocumento;
                        Apellido = req.body.Apellidos;
                        Nombre = req.body.Nombres;
                        Documento = req.body.Documento;
                        Password = req.body.Password;
                        Telefono = req.body.Telefono;
                        Sexo = req.body.Sexo;
                        Observaciones = req.body.Observaciones;
                        FechaNac = req.body.FechaNac;
                        Correo = req.body.Correo;
                        Usuario = req.body.Usuario;
                        Calle = req.body.Calle;
                        Piso = req.body.Piso;
                        Departamento = req.body.Departamento;
                        Ciudad = req.body.Ciudad;
                        Pais = req.body.Pais;
                        Numero = req.body.Numero;
                        Objetivo = req.body.Objetivo;
                        Ocupacion = req.body.Ocupacion;
                        Horario = req.body.Horario;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_editar_cliente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [IdPersona, IdTipoDocumento, Apellido, Nombre, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Objetivo, Ocupacion, Horario])];
                    case 1:
                        result = _a.sent();
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    Mensaje: result[0][0].Mensaje
                                })];
                        }
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //   Lista los clientes inscriptos en un cierto plan
    // ==================================================
    PersonasController.prototype.listarClientesPlan = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPlan, desde, clientes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdPlan = req.params.IdPlan || 0;
                        IdPlan = Number(IdPlan);
                        desde = req.params.desde || 0;
                        desde = Number(desde);
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_clientes_plan(?,?)', [desde, IdPlan])];
                    case 1:
                        clientes = _a.sent();
                        res.json(clientes);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===========================================================================
    // =========================== PROFESIONALES ==========================================
    // ===========================================================================
    // ==================================================
    //        Inserta un profesional
    // ==================================================
    PersonasController.prototype.createProfesional = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdTipoDocumento, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, IdRol, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdTipoDocumento = req.body.IdTipoDocumento;
                        Apellidos = req.body.Apellidos;
                        Nombres = req.body.Nombres;
                        Documento = req.body.Documento;
                        Password = req.body.Password;
                        Telefono = req.body.Telefono;
                        Sexo = req.body.Sexo;
                        Observaciones = req.body.Observaciones;
                        FechaNac = req.body.FechaNac;
                        Correo = req.body.Correo;
                        Usuario = req.body.Usuario;
                        Calle = req.body.Calle;
                        Piso = req.body.Piso;
                        Departamento = req.body.Departamento;
                        Ciudad = req.body.Ciudad;
                        Pais = req.body.Pais;
                        Numero = req.body.Numero;
                        IdRol = req.body.IdRol;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_alta_profesional(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [IdTipoDocumento, IdRol, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, FechaNac,
                                Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero])];
                    case 1:
                        result = _a.sent();
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    Mensaje: result[0][0].Mensaje
                                })];
                        }
                        res.json({ Mensaje: 'Ok' });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Actualiza un profesional
    // ==================================================
    PersonasController.prototype.actualizaProfesional = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, IdTipoDocumento, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, IdRol, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Estado, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.body en actualizaProfesional es : ", req.body);
                        IdPersona = req.body.IdPersona;
                        IdTipoDocumento = req.body.IdTipoDocumento;
                        Apellidos = req.body.Apellidos;
                        Nombres = req.body.Nombres;
                        Documento = req.body.Documento;
                        Password = req.body.Password;
                        Telefono = req.body.Telefono;
                        Sexo = req.body.Sexo;
                        Observaciones = req.body.Observaciones;
                        IdRol = req.body.IdRol;
                        FechaNac = req.body.FechaNac;
                        Correo = req.body.Correo;
                        Usuario = req.body.Usuario;
                        Calle = req.body.Calle;
                        Piso = req.body.Piso;
                        Departamento = req.body.Departamento;
                        Ciudad = req.body.Ciudad;
                        Pais = req.body.Pais;
                        Numero = req.body.Numero;
                        Estado = req.body.Estado;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_actualiza_profesional(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [IdPersona, IdTipoDocumento, IdRol, Apellidos, Nombres, Documento, Password, Telefono, Sexo, Observaciones, FechaNac, Correo, Usuario, Calle, Piso, Departamento, Ciudad, Pais, Numero, Estado])];
                    case 1:
                        result = _a.sent();
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    // ok: false,
                                    Mensaje: result[0][0].Mensaje
                                })];
                        }
                        return [2 /*return*/, res.json({ Mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //   Da de baja un profesional
    // ==================================================
    PersonasController.prototype.darBajaProfesional = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var IdPersona, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        IdPersona = req.params.IdPersona;
                        return [4 /*yield*/, database_1["default"].query('CALL bsp_darbaja_profesional(?)', IdPersona)];
                    case 1:
                        result = _a.sent();
                        if (result[0][0].Mensaje !== 'Ok') {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    mensaje: result.Mensaje
                                })];
                        }
                        return [2 /*return*/, res.json({ mensaje: 'Ok' })];
                }
            });
        });
    };
    // ==================================================
    //        Lista el personal del gimnasio desde cierto valor
    // ==================================================
    PersonasController.prototype.listarPersonal = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desde, incluyeBajas, personal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('req listarPersonal headers es : ', req.headers);
                        desde = req.params.desde;
                        incluyeBajas = req.params.incluyeBajas;
                        return [4 /*yield*/, database_1["default"].query('call bsp_listar_personal(?,?)', [desde, incluyeBajas])];
                    case 1:
                        personal = _a.sent();
                        res.json(personal);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    //        Lista el personal del gimnasio desde cierto valor
    //       Si en pDesde viene '-1' entonces se listan todos los profesionales
    // ==================================================
    PersonasController.prototype.listarProfesionales = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var personal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].query('call bsp_listar_profesionales()')];
                    case 1:
                        personal = _a.sent();
                        res.json(personal);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PersonasController;
}());
var personasController = new PersonasController;
exports["default"] = personasController;
