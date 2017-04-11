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

            // TODO

            close();
        }

        function close() {
            tagedNodes.reward[0].value = "";
            tagedNodes.text[0].value = "";
            $(element).addClass("hidden");
        }
    });