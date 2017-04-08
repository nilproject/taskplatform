var fw = (function () {
    var componentsCache = {};

    function defineComponent(selector, templateUri, styleUri, handler) {
        if (!selector)
            throw "invalid selector";

        if (typeof handler !== "function")
            throw "invalid handler";

        if (selector in componentsCache)
            throw "this selector already allocated";

        componentsCache[selector.toLowerCase()] = {
            templateUri: templateUri,
            styleUri: styleUri,
            templateCode: null,
            loaded: false,
            handler: handler
        };
    }

    function _appendStyle(styleText) {
        var css = styleText;
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

    function _load(url, callback) {
        $.ajax({
            url: url,
            complete: callback
        });
    }

    function bootComponent(element, callback) {
        var cacheRecord = componentsCache[element.nodeName.toLowerCase()];

        function process(e) {
            var childIndex = 0;
            var childs = [];

            function doCicle(cb) {
                if (childIndex < element.childNodes.length) {
                    bootComponent(element.childNodes[childIndex++], function (elem) {
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
                        cacheRecord.handler(element, childs);
                        callback && callback(element);
                    });
                } else {
                    callback && callback(element);
                }
            });
        }

        if (!cacheRecord) {
            process(element);
            return;
        }

        if (!cacheRecord.loaded) {
            var count = !!cacheRecord.templateUri + !!cacheRecord.styleUri;
            var loadCallback = function (setValue, result) {
                if (result.status == 200)
                    setValue(result.responseText);

                if (--count == 0)
                    process(element);
            };

            if (cacheRecord.templateUri) {
                _load(cacheRecord.templateUri, loadCallback.bind(null, function (v) {
                    cacheRecord.templateCode = v;
                }));
            }

            if (cacheRecord.styleUri) {
                _load(cacheRecord.styleUri, loadCallback.bind(null, function (v) {
                    _appendStyle(v);
                }));
            }
        } else {
            process(element);
        }
    }

    function bootstrap(element) {
        bootComponent(element);
    }

    return {
        defineComponent: defineComponent,
        bootstrap: bootstrap,
        _appendStyle,
        _load
    }
})();

// export default fw;