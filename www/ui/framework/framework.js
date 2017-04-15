var fw = (function () {
    "use strict";

    var globalEval = eval;
    var currentScriptUrl = null;
    var embedScripts = "currentScript" in document;
    var lazyLoad = false;
    var componentsCache = {};
    var loadedScripts = {};

    function _IE_currentScript() {
        var scripts = document.head.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i] && scripts[i].readyState === "interactive") {
                return scripts[i];
            }
        }

        return scripts[scripts.length - 1];
    }

    function _extendRelativePath(root, path) {
        if (root[root.length - 1] === "/")
            root = root.substr(0, root.length - 1);

        if (path.startsWith("./"))
            return root + path.substr(1);

        if (path.startsWith("../"))
            return root.split("/").slice(0, -1).join("/") + path.substr(2);

        return path;
    }

    function defineComponent(selector, templateUri, styleUri, requires, handler) {
        if (!selector)
            throw "invalid selector";

        if (typeof handler !== "function")
            throw "invalid handler";

        if (selector in componentsCache)
            throw "this selector is already allocated";

        var uriRoot = "";
        if (embedScripts && document.currentScript) {
            uriRoot = document.currentScript.src;
        } else {
            if (currentScriptUrl) {
                uriRoot = currentScriptUrl;
            } else {
                uriRoot = _IE_currentScript().src;
            }
        }
        uriRoot = uriRoot.split("/").slice(0, -1).join("/") + "/";

        componentsCache[selector.toLowerCase()] = {
            templateUri: _extendRelativePath(uriRoot, templateUri),
            styleUri: _extendRelativePath(uriRoot, styleUri),
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
        script.onerror = cb;
        script.onload = cb;

        head.appendChild(script);
    }

    function _load(uri, callback) {
        if (uri.startsWith("data:")) {
            var commaIndex = uri.indexOf(",");
            if (commaIndex === -1) {
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
        if (!cacheRecord || cacheRecord.loaded) {
            callback && setTimeout(callback, 0);
        }

        var awaitersCount = 0;
        function awaitCallback() {
            awaitersCount--;
            if (awaitersCount === 0) {
                cacheRecord.loaded = true;
                callback && setTimeout(callback, 0);
            }
        }
        
        if (cacheRecord.templateUri) {
            awaitersCount++;
            _load(cacheRecord.templateUri, function (result) {
                if (result.status == 200) {
                    cacheRecord.templateUri = null;
                    cacheRecord.templateCode = result.responseText;
                }

                awaitCallback();
            });
        }

        if (cacheRecord.styleUri) {
            awaitersCount++;
            _load(cacheRecord.styleUri, function (result) {
                if (result.status == 200) {
                    cacheRecord.styleUri = null;
                    _appendStyle(result.responseText);
                }

                awaitCallback();
            });
        }

        for (var dep in cacheRecord.requires) {
            var dependency = cacheRecord.requires[dep];
            if (!(dependency.uri in loadedScripts)) {
                var url = _extendRelativePath(cacheRecord.uriRoot, cacheRecord.requires[dep].uri);
                awaitersCount++;

                var cb = function (dependency, url, response) {
                    loadedScripts[dependency.uri] = null;

                    if (!embedScripts) {
                        if (response.status === 200) {
                            try {
                                currentScriptUrl = url;
                                globalEval(response.responseText);
                            } catch (e) {
                                console.error(e);
                            } finally {
                                currentScriptUrl = null;
                            }
                        }
                    }

                    if (dependency.name && !(dependency.name in componentsCache))
                        console.error("Invalid dependency: " + componentName + " <-- " + dependency.name);

                    if (lazyLoad) {
                        awaitCallback();
                    } else {
                        prefetchComponent(dependency.name, function () {
                            awaitCallback();
                        });
                    }
                };

                var bindCb = cb.bind(null, dependency, url);

                if (embedScripts) {
                    _appendScript(url, bindCb);
                } else {
                    _load(url, bindCb);
                }
            }
        }
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
            get currentPath() {
                return window.location.pathname;
            }
        };
    })();

    return {
        defineComponent: defineComponent,
        bootstrap: bootstrap,
        createElement: createElement,
        prefetchComponent: prefetchComponent,
        navigation: navigation,
        get lazyLoad() {
            return lazyLoad;
        },
        set lazyLoad(value) {
            lazyLoad = !!value;
        }
    }
})();

fw.defineComponent(
    "router-outlet-route",
    "",
    "data:text/css,router-outlet-route { display: none; }",
    [],
    function (app, element, childs) { element._childs = childs; });
fw.prefetchComponent("router-outlet-route");

fw.defineComponent(
    "router-outlet",
    "",
    "data:text/css,router-outlet { display: block; width: 100%; height: 100%; }",
    [],
    function (app, element, rules) {
        var routes = {};

        for (var rule in rules) {
            if (rules[rule].attributes) {
                var componentKV = rules[rule].attributes.getNamedItem("component");
                var paramsKV = rules[rule].attributes.getNamedItem("params");

                var urlKV;
                if (rules[rule].nodeName.toLowerCase() == "router-outlet-route-default") {
                    urlKV = { value: "" };
                } else {
                    urlKV = rules[rule].attributes.getNamedItem("url");
                }

                if (urlKV) {
                    if (componentKV) {
                        routes[urlKV.value] = {
                            component: componentKV.value,
                            params: paramsKV && paramsKV.value
                        };
                    } else {
                        routes[urlKV.value] = {
                            content: rules[rule]._childs,
                            params: paramsKV && paramsKV.value
                        };
                    }
                }
            }
        }

        var currentRoute = null;
        function navHandler(url) {
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

            var route;
            for (var r in routes) {
                if (url.match(r)) {
                    route = routes[r];
                    break;
                }
            }

            if (!route) {
                element.innerHTML = "";
                return;
            }

            if (currentRoute === route)
                return;
            currentRoute = route;

            if (route.component) {
                fw.prefetchComponent(route.component, function () {
                    var child = fw.createElement(app, route.component, JSON.parse(route.params));
                    element.innerHTML = "";
                    element.appendChild(child);
                });
            } else {
                element.innerHTML = "";
                if (route.content) {
                    for (var i = 0, len = route.content.length; i < len; i++) {
                        element.appendChild(route.content[i]);
                    }
                }
            }
        }

        fw.navigation.subscribe(navHandler);
        navHandler(window.location.pathname);
    });