var fw = (function () {
    "use strict";

    var componentsCache = {};

    function defineComponent(selector, templateUri, styleUri, requires, handler) {
        if (!selector)
            throw "invalid selector";

        if (typeof handler !== "function")
            throw "invalid handler";

        if (selector in componentsCache)
            throw "this selector is already allocated";

        var uriRoot = document.currentScript.src.split("/").slice(0, -1).join("/") + "/"

        componentsCache[selector.toLowerCase()] = {
            templateUri: templateUri.startsWith("./") ? uriRoot + templateUri.substr(2) : templateUri,
            styleUri: styleUri.startsWith("./") ? uriRoot + styleUri.substr(2) : styleUri,
            templateCode: null,
            loaded: false,
            loading: false,
            handler: handler,
            requires: requires,
            uriRoot: uriRoot
        };
    }

    function _appendStyle(styleText) {
        var css = "\n" + styleText.trim() + "\n";
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");

        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }

    function _appendScript(scriptUri, cb) {
        var head = document.head || document.getElementsByTagName("head")[0];
        var script = document.createElement("script");

        script.type = "text/javascript";
        script.src = scriptUri;
        script.onload = cb;

        head.appendChild(script);
    }

    function _load(uri, callback) {
        if (uri.startsWith("data:")) {
            var commaIndex = uri.indexOf(",");
            if (commaIndex === -1){
                uri = "";
            } else {
                uri = uri.substr(commaIndex + 1);
            }

            callback({
                responseText: uri,
                status: 200
            });

            return;
        }

        $.ajax({
            url: uri,
            complete: callback,
            dataType: "text"
        });
    }

    function prefetchComponent(componentName, callback) {
        var cacheRecord = componentsCache[componentName];
        if (!cacheRecord) {
            callback && callback();
        }

        function fetch() {
            if (!cacheRecord.loaded) {
                for (var dep in cacheRecord.requires) {
                    if (!(cacheRecord.requires[dep].name in componentsCache)) {
                        var uri = cacheRecord.requires[dep].uri;
                        if (uri.startsWith("./"))
                            uri = cacheRecord.uriRoot + uri.substr(2);

                        _appendScript(uri, function () {
                            if (!(cacheRecord.requires[dep].name in componentsCache))
                                throw "Invalid dependency: " + componentName + " <-- " + cacheRecord.requires[dep].name;

                            fetch();
                        });
                        return;
                    }
                }

                var loadCallback = function (setValue, result) {
                    if (result.status == 200) {
                        setValue(result.responseText);
                        fetch();
                    } else {
                        cacheRecord.loaded = true;
                    }
                };

                if (cacheRecord.templateUri) {
                    _load(cacheRecord.templateUri, loadCallback.bind(null, function (v) {
                        cacheRecord.templateUri = null;
                        cacheRecord.templateCode = v;
                    }));

                    return;
                }

                if (cacheRecord.styleUri) {
                    _load(cacheRecord.styleUri, loadCallback.bind(null, function (v) {
                        cacheRecord.styleUri = null;
                        _appendStyle(v);
                    }));

                    return;
                }

                cacheRecord.loaded = true;
            }

            callback && callback();
        }

        fetch();
    }

    function bootComponent(app, element, params, callback) {
        var componentName = element.nodeName.toLowerCase();
        var cacheRecord = componentsCache[componentName];
        if (!cacheRecord) {
            process(element);
            return;
        }

        function process(e) {
            var childIndex = 0;
            var childs = [];
            var tagedNodes = {};

            function doCicle(cb) {
                if (childIndex < element.childNodes.length) {
                    if (element.childNodes[childIndex].attributes) {
                        var tag = element.childNodes[childIndex].attributes.getNamedItem("fw-tag");
                        if (tag) {
                            if (!(tag.value in tagedNodes))
                                tagedNodes[tag.value] = [];

                            tagedNodes[tag.value].push(element.childNodes[childIndex]);
                        }
                    }

                    bootComponent(app, element.childNodes[childIndex++], null, function (elem, tags) {
                        Object.assign(tagedNodes, tags);
                        childs.push(elem);
                        doCicle(cb);
                    });
                } else {
                    cb();
                }
            }

            doCicle(function () {
                if (cacheRecord) {
                    element.innerHTML = cacheRecord.templateCode || "";
                    doCicle(function () {
                        cacheRecord.handler(app, element, childs, tagedNodes, params);
                        callback && callback(element);
                    });
                } else {
                    callback && callback(element, tagedNodes);
                }
            });
        }

        prefetchComponent(componentName, function () {
            process(element);
        });
    }

    function bootstrap(elementName, app) {
        bootComponent(app || {}, document.getElementsByTagName(elementName)[0]);
    }

    function createElement(app, elementName, params, callback) {
        var element = document.createElement(elementName);
        bootComponent(app, element, params, callback ? function (e) { callback(e); } : undefined);
        return element;
    }

    var navigation = (function () {
        var listeners = [];
        function propogateUri() {
            var listenersTemp = listeners.slice();
            for (var l in listenersTemp) {
                listenersTemp[l](window.location.pathname);
            }
        };

        window.addEventListener("popstate", propogateUri);

        return {
            subscribe: function (handler) {
                if (typeof handler !== "function")
                    throw new TypeError("Invalid argument type");

                if (listeners.indexOf(handler) === -1) {
                    listeners.push(handler);
                }
            },
            unsubscribe: function (handler) {
                if (typeof handler !== "function")
                    throw new TypeError("Invalid argument type");

                var index = listeners.indexOf(handler);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            },
            navigate: function (uri, title) {
                window.history.pushState(title, title, uri);
                propogateUri();
            },
            get currentUri() {
                return window.location.pathname;
            }
        };
    })();

    return {
        defineComponent: defineComponent,
        bootstrap: bootstrap,
        createElement: createElement,
        prefetchComponent: prefetchComponent,
        navigation: navigation
    }
})();

fw.defineComponent(
    "router-outlet-rule",
    "",
    "",
    [],
    function () { });

fw.defineComponent(
    "router-outlet",
    "",
    "data:text/css,router-outlet { display: block; width: 100%; height: 100%; }",
    [],
    function (app, element, rules) {
        var routes = {};

        for (var rule in rules) {
            if (rules[rule].attributes) {
                var uriKV = rules[rule].attributes.getNamedItem("uri");
                var componentKV = rules[rule].attributes.getNamedItem("component");
                var paramsKV = rules[rule].attributes.getNamedItem("params");

                if (uriKV && componentKV) {
                    routes[uriKV.value] = {
                        component: componentKV.value,
                        params: paramsKV.value
                    };
                }
            }
        }

        function navHandler(uri) {
            var isConnected = true;
            if ("isConnected" in element) {
                isConnected = element.isConnected;
            } else {
                var parent = element.parentNode;
                while (parent && parent != document) {
                    parent = parent.parentNode;
                }

                isConnected = !!parent;
            }

            if (!isConnected) {
                fw.navigation.unsubscribe(navHandler);
                return;
            }

            if (!routes[uri]) {
                element.removeChild(element.childNodes[0]);
                return;
            }

            fw.prefetchComponent(routes[uri].component, function () {
                var child = fw.createElement(app, routes[uri].component, JSON.parse(routes[uri].params));
                element.innerHTML = "";
                element.appendChild(child);
            });
        }

        fw.navigation.subscribe(navHandler);
        navHandler(window.location.pathname);
    });

// export default fw;