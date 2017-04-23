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
        var token = app.getQueryParams().token;

        api.getCommission(function (response) {
            if (response.status === 200) {
                tagedNodes.currentCommission[0].innerText = response.responseJSON.commission;
                tagedNodes.newCommission[0].value = response.responseJSON.commission;
            }
        });

        api.getSystemCash(token, function (response) {
            if (response.status === 200) {
                tagedNodes.systemCash[0].innerText = response.responseJSON.cash;
            }
        });

        tagedNodes.systemCash[0];
        tagedNodes.currentCommission[0];
        tagedNodes.changeCommission[0].onclick = function () {
            var newCommission = tagedNodes.newCommission[0].value;
            if (isNaN(newCommission)
                || +newCommission < 0
                || +newCommission > 1) {
                $(tagedNodes.newCommission[0]).addClass("invalid");
                return;
            }

            api.setCommission(newCommission, token, function (response) {
                if (response.status === 200) {
                    tagedNodes.currentCommission[0].innerText = newCommission;
                }
            });
        }
    }
);