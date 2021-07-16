"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
// import morgan from 'morgan';
var cors_1 = __importDefault(require("cors"));
var indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
var personasRoutes_1 = __importDefault(require("./routes/personasRoutes"));
var tiposdocumentosRoutes_1 = __importDefault(require("./routes/tiposdocumentosRoutes"));
var loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
var planesRoutes_1 = __importDefault(require("./routes/planesRoutes"));
var medicionesRoutes_1 = __importDefault(require("./routes/medicionesRoutes"));
var cajaRoutes_1 = __importDefault(require("./routes/cajaRoutes"));
var asistenciaRoutes_1 = __importDefault(require("./routes/asistenciaRoutes"));
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1["default"]();
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.set('port', process.env.PORT || 3000);
        // CORS
        /*this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin: http://localhost", "*");
            // res.header("Access-Control-Allow-Origin", "localhost:4220");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT , DELETE, OPTIONS");
            next();
          });*/
        this.app.use(cors_1["default"]());
        this.app.use(express_1["default"].json());
        this.app.use(express_1["default"].urlencoded({ extended: false }));
    };
    // ==================================================
    //        RUTAS
    // ==================================================
    Server.prototype.routes = function () {
        // ******* Configuracion de CORS ********
        // Creo una lista blanca
        var listaBlanca = ['http://localhost:4200'];
        // Creo la configuracion
        var configuracionCORS = {
            // Creo la funcion 'origin'
            origin: function (req, res) {
                // console.log('req es : ', req);
                // console.log('listaBlanca.indexOf(req) es : ', listaBlanca.indexOf(req));
                // Pregunro si se encontro el valor ; -1 si no se encuentra dicho valor
                if (listaBlanca.indexOf(req) !== -1) {
                    res(null, true);
                }
                else {
                    res(new Error('Bloqueado por CORS'));
                    return;
                }
            }
        };
        this.app.use('/', cors_1["default"](configuracionCORS), indexRoutes_1["default"]);
        this.app.use('/api/personas', personasRoutes_1["default"]);
        this.app.use('/api/tiposdocumentos', tiposdocumentosRoutes_1["default"]);
        this.app.use('/api/login', loginRoutes_1["default"]);
        this.app.use('/api/planes', planesRoutes_1["default"]);
        this.app.use('/api/mediciones', medicionesRoutes_1["default"]);
        this.app.use('/api/caja', cajaRoutes_1["default"]);
        this.app.use('/api/asistencias', asistenciaRoutes_1["default"]);
    };
    // ==================================================
    //   Inicio el servicio en el puerto 3000
    // ==================================================
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get('port'), function () {
            console.log('Server en puerto', _this.app.get('port'));
        });
    };
    return Server;
}());
var server = new Server();
server.start();
