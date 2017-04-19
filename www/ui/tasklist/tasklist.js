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
        var lastTask = null;
        function loadTasks(cb) {
            api.getTasks(params.taskStatus, time, 25, function (response) {
                var loaded = false;
                if (response.status === 200) {
                    var data = response.responseJSON;
                    loaded = !!data.tasks.length;
                    for (var i = 0, len = data.tasks.length; i < len; i++) {
                        var item = fw.createElement(app, "task-list-item", Object.assign({ users: data.users }, data.tasks[i]));

                        time = data.tasks[i].created;
                        tagedNodes.list[0].appendChild(item);

                        lastTask = item;
                    }
                }

                cb && cb(loaded);
            });
        }

        fw.prefetchComponent("task-list-item", function () {
            loadTasks();
        });

        var suppressLoad = false;
        window.addEventListener("scroll", function () {
            if (suppressLoad)
                return;

            if (lastTask.getBoundingClientRect().top < window.innerHeight * 1.2) {
                suppressLoad = true;
                loadTasks(function (loaded) {
                    suppressLoad = !loaded;
                });
            }
        });
    }
)