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
        "use strict";

        var time = 0;
        function loadTasks() {
            api.getTasks(params.taskStatus, time, 25, function (response) {
                if (response.status === 200) {
                    var data = response.responseJSON;
                    for (var i = 0, len = data.tasks.length; i < len; i++) {
                        var item = fw.createElement(app, "task-list-item", Object.assign({ users: data.users }, data.tasks[i]));

                        time = data.tasks[i].created;
                        tagedNodes.list[0].appendChild(item);
                    }
                }
            });
        }

        fw.prefetchComponent("task-list-item", function () {
            loadTasks();
        });
    }
)