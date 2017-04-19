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
            api.createTask(tagedNodes.text[0].value, tagedNodes.reward[0].value, function () {
                app.fireEvent("newtask");
            });
            close();
        }

        function close() {
            tagedNodes.reward[0].value = "";
            tagedNodes.text[0].value = "";
            $(element).addClass("hidden");
        }

        function open() {
            tagedNodes.reward[0].value = "";
            tagedNodes.text[0].value = "";
            $(element).removeClass("hidden");
        }

        element._open = open;
        element._close = close;
    });