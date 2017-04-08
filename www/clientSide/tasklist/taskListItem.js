fw.defineComponent(
    "task-list-item",
    "/clientSide/tasklist/taskListItem.html",
    "/clientSide/tasklist/taskListItem.css",
    [],
    function (element, childs, tagedNodes, params) {
        tagedNodes.text[0].innerText = params.text;
        tagedNodes.name[0].innerText = "Big Boss";
        tagedNodes.time[0].innerText = Date();
    }
)