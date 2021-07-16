"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var indexController_1 = __importDefault(require("../controllers/indexController"));
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    IndexRoutes.prototype.config = function () {
        this.router.get('/', indexController_1["default"].index);
    };
    return IndexRoutes;
}());
var indexRoutes = new IndexRoutes();
exports["default"] = indexRoutes.router;
// export default new GameRoutes().router;
