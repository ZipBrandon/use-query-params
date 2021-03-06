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
exports.useQueryParams = void 0;
var React = __importStar(require("react"));
var serialize_query_params_1 = require("serialize-query-params");
var helpers_1 = require("./helpers");
var LocationProvider_1 = require("./LocationProvider");
var memoizedQueryParser_1 = require("./memoizedQueryParser");
var shallowEqual_1 = __importDefault(require("./shallowEqual"));
/**
 * Helper to get the latest decoded values with smart caching.
 * Abstracted into its own function to allow re-use in a functional setter (#26)
 */
function getLatestDecodedValues(location, paramConfigMap, paramConfigMapRef, parsedQueryRef, encodedValuesCacheRef, decodedValuesCacheRef) {
    // check if we have a new param config
    var hasNewParamConfigMap = !(0, shallowEqual_1.default)(paramConfigMapRef.current, paramConfigMap);
    // read in the parsed query
    var parsedQuery = (0, memoizedQueryParser_1.sharedMemoizedQueryParser)((0, helpers_1.getSSRSafeSearchString)(location) // get the latest location object
    );
    // check if new encoded values are around (new parsed query).
    // can use triple equals since we already cache this value
    var hasNewParsedQuery = parsedQueryRef.current !== parsedQuery;
    // if nothing has changed, use existing.. so long as we have existing.
    if (!hasNewParsedQuery &&
        !hasNewParamConfigMap &&
        encodedValuesCacheRef.current !== undefined) {
        return {
            encodedValues: encodedValuesCacheRef.current,
            decodedValues: decodedValuesCacheRef.current,
        };
    }
    var encodedValuesCache = encodedValuesCacheRef.current || {};
    var decodedValuesCache = decodedValuesCacheRef.current || {};
    var encodedValues = {};
    // we have new encoded values, so let's get new decoded values.
    // recompute new values but only for those that changed
    var paramNames = Object.keys(paramConfigMap);
    var decodedValues = {};
    for (var _i = 0, paramNames_1 = paramNames; _i < paramNames_1.length; _i++) {
        var paramName = paramNames_1[_i];
        // do we have a new encoded value?
        var paramConfig = paramConfigMap[paramName];
        var hasNewEncodedValue = !(0, shallowEqual_1.default)(encodedValuesCache[paramName], parsedQuery[paramName]);
        // if we have a new encoded value, re-decode. otherwise reuse cache
        var encodedValue = void 0;
        var decodedValue = void 0;
        if (hasNewEncodedValue ||
            (encodedValuesCache[paramName] === undefined &&
                decodedValuesCache[paramName] === undefined)) {
            encodedValue = parsedQuery[paramName];
            decodedValue = paramConfig.decode(encodedValue);
        }
        else {
            encodedValue = encodedValuesCache[paramName];
            decodedValue = decodedValuesCache[paramName];
        }
        encodedValues[paramName] = encodedValue;
        decodedValues[paramName] = decodedValue;
    }
    // keep referential equality for decoded valus if we didn't actually change anything
    var hasNewDecodedValues = !(0, shallowEqual_1.default)(decodedValuesCacheRef.current, decodedValues, paramConfigMap);
    return {
        encodedValues: encodedValues,
        decodedValues: hasNewDecodedValues
            ? decodedValues
            : decodedValuesCacheRef.current,
    };
}
/**
 * Given a query parameter configuration (mapping query param name to { encode, decode }),
 * return an object with the decoded values and a setter for updating them.
 */
var useQueryParams = function (paramConfigMap) {
    var _a = (0, LocationProvider_1.useLocationContext)(), location = _a.location, getLocation = _a.getLocation, setLocation = _a.setLocation;
    // read in the raw query
    var parsedQuery = (0, memoizedQueryParser_1.sharedMemoizedQueryParser)((0, helpers_1.getSSRSafeSearchString)(location));
    // make caches
    var paramConfigMapRef = React.useRef(paramConfigMap);
    var parsedQueryRef = React.useRef(parsedQuery);
    var encodedValuesCacheRef = React.useRef(undefined); // undefined for initial check
    var decodedValuesCacheRef = React.useRef({});
    // memoize paramConfigMap to make the API nicer for consumers.
    // otherwise we'd have to useQueryParams(useMemo(() => { foo: NumberParam }, []))
    paramConfigMap = (0, shallowEqual_1.default)(paramConfigMap, paramConfigMapRef.current)
        ? paramConfigMapRef.current
        : paramConfigMap;
    // decode all the values if we have changes
    var _b = getLatestDecodedValues(location, paramConfigMap, paramConfigMapRef, parsedQueryRef, encodedValuesCacheRef, decodedValuesCacheRef), encodedValues = _b.encodedValues, decodedValues = _b.decodedValues;
    // update cached values in useEffects
    (0, helpers_1.useUpdateRefIfShallowNew)(parsedQueryRef, parsedQuery);
    (0, helpers_1.useUpdateRefIfShallowNew)(paramConfigMapRef, paramConfigMap);
    (0, helpers_1.useUpdateRefIfShallowNew)(encodedValuesCacheRef, encodedValues);
    (0, helpers_1.useUpdateRefIfShallowNew)(decodedValuesCacheRef, decodedValues, function (a, b) {
        return (0, shallowEqual_1.default)(a, b, paramConfigMap);
    });
    // create a setter for updating multiple query params at once
    var setQueryDeps = {
        paramConfigMap: paramConfigMap,
        setLocation: setLocation,
        getLocation: getLocation,
    };
    var setQueryDepsRef = React.useRef(setQueryDeps);
    setQueryDepsRef.current = setQueryDeps;
    var setQuery = React.useCallback(function (changes, updateType) {
        var deps = setQueryDepsRef.current;
        var encodedChanges;
        if (typeof changes === 'function') {
            // get latest decoded value to pass as a fresh arg to the setter fn
            var latestValues = getLatestDecodedValues(deps.getLocation(), deps.paramConfigMap, paramConfigMapRef, parsedQueryRef, encodedValuesCacheRef, decodedValuesCacheRef).decodedValues;
            decodedValuesCacheRef.current = latestValues; // keep cache in sync
            encodedChanges = (0, serialize_query_params_1.encodeQueryParams)(deps.paramConfigMap, changes(latestValues));
        }
        else {
            // encode as strings for the URL
            encodedChanges = (0, serialize_query_params_1.encodeQueryParams)(deps.paramConfigMap, changes);
        }
        // update the URL
        deps.setLocation(encodedChanges, updateType);
    }, []);
    // no longer Partial
    return [decodedValues, setQuery];
};
exports.useQueryParams = useQueryParams;
exports.default = exports.useQueryParams;
