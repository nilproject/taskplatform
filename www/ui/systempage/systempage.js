fw.defineComponent(
    "system-page",
    "./systempage.html",
    "./systempage.css",
    [
        {
            name: "transaction-list",
            uri: "../transactionlist/transactionlist.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.systemCash[0];
        tagedNodes.currentCommission[0];
        tagedNodes.changeCommission[0].onclick = function () {
            tagedNodes.newCommission[0].value
        }
    }
);