fw.defineComponent(
    "task-list-item",
    "./taskListItem.html",
    "./taskListItem.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.text[0].innerText = params.text;
        tagedNodes.name[0].innerText = app.user.name;
        tagedNodes.time[0].innerText = Date();
        tagedNodes.avatar[0].src = app.user.avatarUrl;

        if (app.user.allowExecuteTasks) {
            tagedNodes.doButton[0].onclick = function () {

            }
        } else {
            tagedNodes.doButton[0].parentNode.removeChild(tagedNodes.doButton[0]);
        }
    }
)