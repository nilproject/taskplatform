fw.defineComponent(
    "new-task-dialog",
    "./newtaskdialog.html",
    "./newtaskdialog.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.cancel[0].onclick = function () {
            close();
        }

        tagedNodes.submit[0].onclick = function () {
            var valid = true;
            if (tagedNodes.reward[0].value.length === 0
                || isNaN(tagedNodes.reward[0].value)
                || tagedNodes.reward[0].value.length >= 7) {
                $(tagedNodes.reward[0]).addClass("invalid");
                valid = false;
            }

            if (tagedNodes.text[0].value.length === 0
                || tagedNodes.text[0].value.length > 4096) {
                $(tagedNodes.text[0]).addClass("invalid");
                valid = false;
            }

            if (!valid)
                return;

            api.createTask(tagedNodes.text[0].value, tagedNodes.reward[0].value, function (response) {
                if (response.status == 200) {
                    app.fireEvent(app.events.newtask);
                    app.fireEvent(app.events.cashUpdated);
                    close();
                } else if (response.status == 402) {
                    $(tagedNodes.reward[0]).addClass("invalid");
                } else {
                    $(element).addClass("invalid");
                }
            });
        }

        function close() {
            tagedNodes.reward[0].value = "";
            tagedNodes.text[0].value = "";
            $(tagedNodes.text[0]).removeClass("invalid");
            $(tagedNodes.reward[0]).removeClass("invalid");
            $(element).addClass("hidden");
        }

        function open() {
            tagedNodes.reward[0].value = "";
            tagedNodes.text[0].value = "";
            $(tagedNodes.text[0]).removeClass("invalid");
            $(tagedNodes.reward[0]).removeClass("invalid");
            $(element).removeClass("hidden");
        }

        element._open = open;
        element._close = close;

        function removeInvalidClass() {
            $(this).removeClass("invalid");
        }

        tagedNodes.text[0].onchange = removeInvalidClass;
        tagedNodes.text[0].oninput = removeInvalidClass;
        tagedNodes.reward[0].onchange = removeInvalidClass;
        tagedNodes.reward[0].oninput = removeInvalidClass;
    });