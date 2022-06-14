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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationProvider = exports.useLocationContext = exports.LocationContext = void 0;
var React = __importStar(require("react"));
var updateUrlQuery_1 = require("./updateUrlQuery");
var providerlessContextValue = {
    location: {},
    getLocation: function () { return ({}); },
    setLocation: function () {
    },
};
exports.LocationContext = React.createContext(providerlessContextValue);
function useLocationContext() {
    var context = React.useContext(exports.LocationContext);
    if (process.env.NODE_ENV !== 'production' &&
        (context === undefined || context === providerlessContextValue)) {
        throw new Error('useQueryParams must be used within a QueryParamProvider');
    }
    return context;
}
exports.useLocationContext = useLocationContext;
/**
 * An internal-only context provider which provides down the most
 * recent location object and a callback to update the history.
 */
function LocationProvider(_a) {
    var history = _a.history, location = _a.location, children = _a.children, stringifyOptions = _a.stringifyOptions;
    var locationRef = React.useRef(location);
    React.useEffect(function () {
        locationRef.current = location;
    }, [location]);
    // TODO: we can probably simplify this now that we are reading location from history
    var getLocation = React.useCallback(function () { return locationRef.current; }, [
        locationRef,
    ]);
    var setLocation = React.useCallback(function (queryReplacements, updateType) {
        var loc = history == null || history.location == null
            ? __assign(__assign({}, locationRef.current), { pathname: location.pathname }) : history.location;
        // A ref is needed here to stop setLocation updating constantly (see #46)
        locationRef.current = (0, updateUrlQuery_1.createLocationWithChanges)(queryReplacements, loc, updateType, stringifyOptions);
        if (history) {
            (0, updateUrlQuery_1.updateUrlQuery)(history, locationRef.current, updateType);
        }
    }, [history, location, stringifyOptions]);
    return (React.createElement(exports.LocationContext.Provider, { value: { location: location, getLocation: getLocation, setLocation: setLocation } }, children));
}
exports.LocationProvider = LocationProvider;
