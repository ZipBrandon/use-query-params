"use strict";
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
exports.getSSRSafeSearchString = exports.useUpdateRefIfShallowNew = void 0;
var React = __importStar(require("react"));
var query_string_1 = require("query-string");
var shallowEqual_1 = __importDefault(require("./shallowEqual"));
function useUpdateRefIfShallowNew(ref, newValue, isEqual) {
    if (isEqual === void 0) { isEqual = shallowEqual_1.default; }
    var hasNew = ((ref.current == null || newValue == null) && ref.current === newValue) ||
        !isEqual(ref.current, newValue);
    React.useEffect(function () {
        if (hasNew) {
            ref.current = newValue;
        }
    }, [ref, newValue, hasNew]);
}
exports.useUpdateRefIfShallowNew = useUpdateRefIfShallowNew;
function getSSRSafeSearchString(location) {
    // handle checking SSR (#13)
    if (typeof location === 'object') {
        // in browser
        if (typeof window !== 'undefined') {
            return location.search;
        }
        else {
            return (0, query_string_1.extract)("".concat(location.pathname).concat(location.search ? location.search : ''));
        }
    }
    return '';
}
exports.getSSRSafeSearchString = getSSRSafeSearchString;
