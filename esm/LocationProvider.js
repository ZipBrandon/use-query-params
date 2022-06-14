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
import * as React from 'react';
import { updateUrlQuery, createLocationWithChanges } from './updateUrlQuery';
var providerlessContextValue = {
    location: {},
    getLocation: function () { return ({}); },
    setLocation: function () {
    },
};
export var LocationContext = React.createContext(providerlessContextValue);
export function useLocationContext() {
    var context = React.useContext(LocationContext);
    if (process.env.NODE_ENV !== 'production' &&
        (context === undefined || context === providerlessContextValue)) {
        throw new Error('useQueryParams must be used within a QueryParamProvider');
    }
    return context;
}
/**
 * An internal-only context provider which provides down the most
 * recent location object and a callback to update the history.
 */
export function LocationProvider(_a) {
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
        locationRef.current = createLocationWithChanges(queryReplacements, loc, updateType, stringifyOptions);
        if (history) {
            updateUrlQuery(history, locationRef.current, updateType);
        }
    }, [history, location, stringifyOptions]);
    return (React.createElement(LocationContext.Provider, { value: { location: location, getLocation: getLocation, setLocation: setLocation } }, children));
}
