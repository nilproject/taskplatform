fw.defineComponent(
    "transaction-list",
    "./transactionlist.html",
    "./transactionlist.css",
    [
        {
            name: "transaction-list-item",
            uri: "./transactionlistitem.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
    }
);