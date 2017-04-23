fw.defineComponent(
    "transaction-list",
    "./transactionlist.html",
    "./transactionlist.css",
    [
        {
            name: "transaction-list-item",
            uri: "./transactionlistItem.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        "use strict";

        var token = app.getQueryParams().token;
        var newestTimestamp = null;
        var oldestTimestamp = 0;
        var lastTransaction = null;
        var updateInterval = setInterval(loadNewTransactions, 12500);

        function loadNewTransactions() {
            api.getNewerTransactions(newestTimestamp || 0, 25, token, function (response) {
                if (response.status === 200) {
                    var data = response.responseJSON;
                    for (var i = 0, len = data.transactions.length; i < len; i++) {
                        var item = fw.createElement(app, "transaction-list-item", data.transactions[i]);

                        newestTimestamp = data.transactions[i].created;

                        if (tagedNodes.list[0].childNodes.length === 0)
                            tagedNodes.list[0].appendChild(item);

                        tagedNodes.list[0].insertBefore(item, tagedNodes.list[0].childNodes[0]);
                    }
                }
            });
        }

        function loadTransactions(cb) {
            api.getTransactions(oldestTimestamp, 25, token, function (response) {
                var loaded = false;
                if (response.status === 200) {
                    var data = response.responseJSON;
                    loaded = !!data.transactions.length;
                    for (var i = 0, len = data.transactions.length; i < len; i++) {
                        var item = fw.createElement(app, "transaction-list-item", data.transactions[i]);

                        oldestTimestamp = data.transactions[i].created;
                        if (newestTimestamp === null)
                            newestTimestamp = data.transactions[i].created;

                        tagedNodes.list[0].appendChild(item);

                        lastTransaction = item;
                    }
                }

                cb && cb(loaded);
            });
        }

        fw.prefetchComponent("transaction-list-item", function () {
            loadTransactions();
        });

        var suppressLoad = false;
        window.addEventListener("scroll", function () {
            if (suppressLoad)
                return;

            if (lastTransaction.getBoundingClientRect().top < window.innerHeight * 1.2) {
                suppressLoad = true;
                loadTransactions(function (loaded) {
                    suppressLoad = !loaded;
                });
            }
        });
    }
);