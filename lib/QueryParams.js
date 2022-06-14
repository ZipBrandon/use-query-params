"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = void 0;
var useQueryParams_1 = __importDefault(require("./useQueryParams"));
var QueryParams = function (_a) {
    var config = _a.config, children = _a.children;
    var _b = (0, useQueryParams_1.default)(config), query = _b[0], setQuery = _b[1];
    return children({ query: query, setQuery: setQuery });
};
exports.QueryParams = QueryParams;
exports.default = exports.QueryParams;
