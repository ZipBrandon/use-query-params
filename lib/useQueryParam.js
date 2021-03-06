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
exports.useQueryParam = void 0;
var React = __importStar(require("react"));
var serialize_query_params_1 = require("serialize-query-params");
var helpers_1 = require("./helpers");
var LocationProvider_1 = require("./LocationProvider");
var memoizedQueryParser_1 = require("./memoizedQueryParser");
var shallowEqual_1 = __importDefault(require("./shallowEqual"));
/**
 * Helper to get the latest decoded value with smart caching.
 * Abstracted into its own function to allow re-use in a functional setter (#26)
 */
function getLatestDecodedValue(location, name, paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef) {
    var _a;
    // check if we have a new param config
    var hasNewParamConfig = !(0, shallowEqual_1.default)(paramConfigRef.current, paramConfig);
    var isValueEqual = (_a = paramConfig.equals) !== null && _a !== void 0 ? _a : shallowEqual_1.default;
    // read in the parsed query
    var parsedQuery = (0, memoizedQueryParser_1.sharedMemoizedQueryParser)((0, helpers_1.getSSRSafeSearchString)(location) // get the latest location object
    );
    // read in the encoded string value (we have to check cache if available because
    // sometimes the query string changes so we get a new parsedQuery but this value
    // didn't change, so we should avoid generating a new array or whatever value)
    var hasNewEncodedValue = !(0, shallowEqual_1.default)(encodedValueCacheRef.current, parsedQuery[name]);
    var encodedValue = hasNewEncodedValue
        ? parsedQuery[name]
        : encodedValueCacheRef.current;
    // only decode if we have changes to encoded value or the config.
    // check for undefined to handle initial case
    if (!hasNewEncodedValue &&
        !hasNewParamConfig &&
        decodedValueCacheRef.current !== undefined) {
        return decodedValueCacheRef.current;
    }
    var newDecodedValue = paramConfig.decode(encodedValue);
    var hasNewDecodedValue = ((decodedValueCacheRef.current == null || newDecodedValue == null) &&
        decodedValueCacheRef.current === newDecodedValue) ||
        !isValueEqual(decodedValueCacheRef.current, newDecodedValue);
    // if we have a new decoded value use it, otherwise use cached
    return hasNewDecodedValue
        ? newDecodedValue
        : decodedValueCacheRef.current;
}
/**
 * Given a query param name and query parameter configuration ({ encode, decode })
 * return the decoded value and a setter for updating it.
 *
 * The setter takes two arguments (newValue, updateType) where updateType
 * is one of 'replace' | 'replaceIn' | 'push' | 'pushIn', defaulting to
 * 'pushIn'.
 *
 * You may optionally pass in a rawQuery object, otherwise the query is derived
 * from the location available in the context.
 *
 * D = decoded type
 * D2 = return value from decode (typically same as D)
 */
var useQueryParam = function (name, paramConfig) {
    if (paramConfig === void 0) { paramConfig = serialize_query_params_1.StringParam; }
    var _a = (0, LocationProvider_1.useLocationContext)(), location = _a.location, getLocation = _a.getLocation, setLocation = _a.setLocation;
    // read in the raw query
    var parsedQuery = (0, memoizedQueryParser_1.sharedMemoizedQueryParser)((0, helpers_1.getSSRSafeSearchString)(location));
    // make caches
    var encodedValueCacheRef = React.useRef();
    var paramConfigRef = React.useRef(paramConfig);
    var decodedValueCacheRef = React.useRef();
    var decodedValue = getLatestDecodedValue(location, name, paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef);
    // update cached values in a useEffect
    (0, helpers_1.useUpdateRefIfShallowNew)(encodedValueCacheRef, parsedQuery[name]);
    (0, helpers_1.useUpdateRefIfShallowNew)(paramConfigRef, paramConfig);
    (0, helpers_1.useUpdateRefIfShallowNew)(decodedValueCacheRef, decodedValue, paramConfig.equals);
    // create the setter, memoizing via useCallback
    var setValueDeps = {
        paramConfig: paramConfig,
        name: name,
        setLocation: setLocation,
        getLocation: getLocation,
    };
    var setValueDepsRef = React.useRef(setValueDeps);
    setValueDepsRef.current = setValueDeps;
    var setValue = React.useCallback(function setValueCallback(newValue, updateType) {
        var _a;
        var deps = setValueDepsRef.current;
        var newEncodedValue;
        // allow functional updates #26
        if (typeof newValue === 'function') {
            // get latest decoded value to pass as a fresh arg to the setter fn
            var latestValue = getLatestDecodedValue(deps.getLocation(), deps.name, deps.paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef);
            decodedValueCacheRef.current = latestValue; // keep cache in sync
            newEncodedValue = deps.paramConfig.encode(newValue(latestValue));
        }
        else {
            newEncodedValue = deps.paramConfig.encode(newValue);
        }
        // update the URL
        deps.setLocation((_a = {}, _a[deps.name] = newEncodedValue, _a), updateType);
    }, []);
    return [decodedValue, setValue];
};
exports.useQueryParam = useQueryParam;
