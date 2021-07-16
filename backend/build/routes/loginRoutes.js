"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var loginController_1 = __importDefault(require("../controllers/loginController"));
var LoginRoutes = /** @class */ (function () {
    function LoginRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    LoginRoutes.prototype.config = function () {
        this.router.post('/', loginController_1["default"].log);
        this.router.get('/control/estado/:IdPersona', loginController_1["default"].actualizaEstadoCliente);
    };
    return LoginRoutes;
}());
exports["default"] = new LoginRoutes().router;
