fw.defineComponent(
    "task-list",
    "./tasklist.html",
    "./tasklist.css",
    [
        {
            name: "task-list-item",
            uri: "./taskListItem.js",
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        fw.prefetchComponent("task-list-item", function () {
            for (var i = 0; i < 10; i++) {
                tagedNodes.list[0].appendChild(fw.createElement(app, "task-list-item", {
                    text: params.tasksType
                }));
            }
        });
    }
)