fw.defineComponent(
    "transaction-list-item",
    "./transactionlistItem.html",
    "./transactionlistItem.css",
    [
    ],
    function (app, element, childs, tagedNodes, params) {
        "use strict";

        var body = tagedNodes.body[0];

        var text = "";
        for (var property in params) {
            if (property === "created") {
                text += property + ": " + new Date(params[property]);
            } else {
                text += property + ": " + params[property];
            }
            text += "\n";
        }

        body.innerText = text;
    }
);