"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedMemoizedQueryParser = exports.makeMemoizedQueryParser = void 0;
var query_string_1 = require("query-string");
var makeMemoizedQueryParser = function (initialSearchString) {
    var cachedSearchString = initialSearchString;
    var cachedParsedQuery = (0, query_string_1.parse)(cachedSearchString || '');
    return function (newSearchString) {
        if (cachedSearchString !== newSearchString) {
            cachedSearchString = newSearchString;
            cachedParsedQuery = (0, query_string_1.parse)(cachedSearchString);
        }
        return cachedParsedQuery;
    };
};
exports.makeMemoizedQueryParser = makeMemoizedQueryParser;
exports.sharedMemoizedQueryParser = (0, exports.makeMemoizedQueryParser)();
