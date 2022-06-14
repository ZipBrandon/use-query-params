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
import { LocationProvider } from './LocationProvider';
import shallowEqual from './shallowEqual';
import { useLocation, useNavigate } from '@remix-run/react';
// we use a lazy caching solution to prevent #46 from happening
var cachedWindowHistory;
var cachedAdaptedWindowHistory;
/**
 * Adapts standard DOM window history to work with our
 * { replace, push } interface.
 *
 * @param history Standard history provided by DOM
 */
function adaptWindowHistory(history) {
    if (history === cachedWindowHistory && cachedAdaptedWindowHistory != null) {
        return cachedAdaptedWindowHistory;
    }
    var adaptedWindowHistory = {
        replace: function (location) {
            history.replaceState(location.state, '', "".concat(location.protocol, "//").concat(location.host).concat(location.pathname).concat(location.search));
        },
        push: function (location) {
            history.pushState(location.state, '', "".concat(location.protocol, "//").concat(location.host).concat(location.pathname).concat(location.search));
        },
        get location() {
            return window.location;
        },
    };
    cachedWindowHistory = history;
    cachedAdaptedWindowHistory = adaptedWindowHistory;
    return adaptedWindowHistory;
}
// we use a lazy caching solution to prevent #46 from happening
var cachedReachHistory;
var cachedAdaptedReachHistory;
/**
 * Adapts @reach/router history to work with our
 * { replace, push } interface.
 *
 * @param history globalHistory from @reach/router
 */
function adaptReachHistory(history) {
    if (history === cachedReachHistory && cachedAdaptedReachHistory != null) {
        return cachedAdaptedReachHistory;
    }
    var adaptedReachHistory = {
        replace: function (location) {
            history.navigate("".concat(location.protocol, "//").concat(location.host).concat(location.pathname).concat(location.search), { replace: true });
        },
        push: function (location) {
            history.navigate("".concat(location.protocol, "//").concat(location.host).concat(location.pathname).concat(location.search), { replace: false });
        },
        get location() {
            return history.location;
        },
    };
    cachedReachHistory = history;
    cachedAdaptedReachHistory = adaptedReachHistory;
    return adaptedReachHistory;
}
/**
 * Helper to produce the context value falling back to
 * window history and location if not provided.
 */
export function getLocationProps(_a) {
    var _b = _a === void 0 ? {} : _a, history = _b.history, location = _b.location;
    var hasWindow = typeof window !== 'undefined';
    if (hasWindow) {
        if (!history) {
            history = adaptWindowHistory(window.history);
        }
        if (!location) {
            location = window.location;
        }
    }
    if (!location) {
        throw new Error("\n        Could not read the location. Is the router wired up correctly?\n      ");
    }
    return { history: history, location: location };
}
export var RouteAdapter = function (_a) {
    var children = _a.children;
    var location = useLocation();
    var navigate = useNavigate();
    var adaptedHistory = React.useMemo(function () { return ({
        replace: function (loc) {
            navigate(loc, { replace: true, state: loc.state });
        },
        push: function (loc) {
            navigate(loc, { replace: false, state: loc.state });
        },
    }); }, [navigate]);
    return children({ history: adaptedHistory, location: location });
};
/**
 * Context provider for query params to have access to the
 * active routing system, enabling updates to the URL.
 */
export function QueryParamProvider(_a) {
    var children = _a.children, stringifyOptions = _a.stringifyOptions;
    // cache the stringify options object so we users can just do
    // <QueryParamProvider stringifyOptions={{ encode: false }} />
    var stringifyOptionsRef = React.useRef(stringifyOptions);
    var hasNewStringifyOptions = !shallowEqual(stringifyOptionsRef.current, stringifyOptions);
    var stringifyOptionsCached = hasNewStringifyOptions
        ? stringifyOptions
        : stringifyOptionsRef.current;
    React.useEffect(function () {
        stringifyOptionsRef.current = stringifyOptionsCached;
    }, [stringifyOptionsCached]);
    // if we have React Router, use it to get the context value
    return (React.createElement(RouteAdapter, null, function (routeProps) {
        return (React.createElement(LocationProvider, __assign({ stringifyOptions: stringifyOptionsCached }, getLocationProps(routeProps)), children));
    }));
}
export default QueryParamProvider;
