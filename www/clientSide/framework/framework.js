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

        componentsCache[selector.toLowerCase()] = {
            templateUri: templateUri,
            styleUri: styleUri,
            templateCode: null,
            loaded: false,
            loading: false,
            handler: handler,
            requires: requires
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

    function _load(url, callback) {
        $.ajax({
            url: url,
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
                        _appendScript(cacheRecord.requires[dep].uri, function () {
                            if (!(cacheRecord.requires[dep].name in componentsCache))
                                throw "Invalid dependency: " + element.nodeName.toLowerCase() + " <-- " + cacheRecord.requires[dep].name;

                            fetch();
                        });
                        return;
                    }
                }

                var loadCallback = function (setValue, result) {
                    if (result.status == 200)
                        setValue(result.responseText);

                    fetch();
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

    function bootComponent(element, params, callback) {
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

                    bootComponent(element.childNodes[childIndex++], null, function (elem, tags) {
                        Object.assign(tagedNodes, tags);
                        childs.push(elem);
                        doCicle(cb);
                    });
                } else {
                    cb();
                }
            }

            doCicle(function () {
                if (cacheRecord && cacheRecord.templateCode !== null) {
                    element.innerHTML = cacheRecord.templateCode;
                    doCicle(function () {
                        cacheRecord.handler(element, childs, tagedNodes, params);
                        callback && callback(element, tagedNodes);
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

    function bootstrap(elementName) {
        bootComponent(document.getElementsByTagName(elementName)[0]);
    }

    function createElement(elementName, params, callback) {
        var element = document.createElement(elementName);
        bootComponent(element, params, callback);
        return element;
    }

    return {
        defineComponent: defineComponent,
        bootstrap: bootstrap,
        createElement: createElement,
        prefetchComponent: prefetchComponent
    }
})();

// export default fw;