fw.defineComponent(
    "enroll-dialog",
    "./enrolldialog.html",
    "./enrolldialog.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.cancel[0].onclick = function () {
            close();
        }

        tagedNodes.submit[0].onclick = function () {
            var valid = true;
            if (tagedNodes.amount[0].value.length === 0
                || isNaN(Number(tagedNodes.amount[0].value))
                || tagedNodes.amount[0].value.length >= 7) {
                $(tagedNodes.amount[0]).addClass("invalid");
                valid = false;
            }

            if (!valid)
                return;

            api.enrollFunds(tagedNodes.amount[0].value, function (response) {
                if (response.status == 200) {
                    app.fireEvent(app.events.cashUpdated);
                    close();
                } else if (response.status == 402) {
                    $(tagedNodes.amount[0]).addClass("invalid");
                } else {
                    $(element).addClass("invalid");
                }
            });
        }

        function close() {
            tagedNodes.amount[0].value = "";
            $(element).addClass("hidden");
        }

        function open() {
            tagedNodes.amount[0].value = "";
            $(element).removeClass("hidden");
        }

        element._open = open;
        element._close = close;

        function removeInvalidClass() {
            $(this).removeClass("invalid");
        }

        tagedNodes.amount[0].onchange = removeInvalidClass;
        tagedNodes.amount[0].oninput = removeInvalidClass;
    });