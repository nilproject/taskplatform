if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

if (!("currentScript" in document)) {
    Object.defineProperty(document, "currentScript", {
        enumerable: false,
        configurable: true,
        get: function () {
            "use strict";
            var scripts = document.head.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i] && scripts[i].readyState === "interactive") {
                    return scripts[i];
                }
            }

            return scripts[scripts.length - 1];
        }
    });
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, "startsWith", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (s) {
            "use strict";
            return this.toString().indexOf(s) === 0;
        }
    });
}