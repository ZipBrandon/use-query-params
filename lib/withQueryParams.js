"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withQueryParamsMapped = exports.withQueryParams = void 0;
var React = __importStar(require("react"));
var useQueryParams_1 = __importDefault(require("./useQueryParams"));
/**
 * HOC to provide query parameters via props `query` and `setQuery`
 * NOTE: I couldn't get type to automatically infer generic when
 * using the format withQueryParams(config)(component), so I switched
 * to withQueryParams(config, component).
 * See: https://github.com/microsoft/TypeScript/issues/30134
 */
function withQueryParams(paramConfigMap, WrappedComponent) {
    // return a FC that takes props excluding query and setQuery
    var Component = function (props) {
        var _a = (0, useQueryParams_1.default)(paramConfigMap), query = _a[0], setQuery = _a[1];
        // see https://github.com/microsoft/TypeScript/issues/28938#issuecomment-450636046 for why `...props as P`
        return (React.createElement(WrappedComponent, __assign({ query: query, setQuery: setQuery }, props)));
    };
    Component.displayName = "withQueryParams(".concat(WrappedComponent.displayName || WrappedComponent.name || 'Component', ")");
    return Component;
}
exports.withQueryParams = withQueryParams;
exports.default = withQueryParams;
/**
 * HOC to provide query parameters via props mapToProps (similar to
 * react-redux connect style mapStateToProps)
 * NOTE: I couldn't get type to automatically infer generic when
 * using the format withQueryParams(config)(component), so I switched
 * to withQueryParams(config, component).
 * See: https://github.com/microsoft/TypeScript/issues/30134
 */
function withQueryParamsMapped(paramConfigMap, mapToProps, WrappedComponent) {
    // return a FC that takes props excluding query and setQuery
    var Component = function (props) {
        var _a = (0, useQueryParams_1.default)(paramConfigMap), query = _a[0], setQuery = _a[1];
        var propsToAdd = mapToProps(query, setQuery, props);
        // see https://github.com/microsoft/TypeScript/issues/28938#issuecomment-450636046 for why `...props as P`
        return React.createElement(WrappedComponent, __assign({}, propsToAdd, props));
    };
    Component.displayName = "withQueryParams(".concat(WrappedComponent.displayName || WrappedComponent.name || 'Component', ")");
    return Component;
}
exports.withQueryParamsMapped = withQueryParamsMapped;
