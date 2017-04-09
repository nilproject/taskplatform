fw.defineComponent(
    "task-list-item",
    "./taskListItem.html",
    "./taskListItem.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.text[0].innerText = params.text;
        tagedNodes.name[0].innerText = "Big Boss";
        tagedNodes.time[0].innerText = Date();
    }
)