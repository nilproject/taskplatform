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
            api.getTasks(params.tasksType, function (response) {
                if (response.status === 200) {
                    console.log(response.responseJSON);
                }
            });
        });
    }
)