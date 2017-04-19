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

        var newestTimestamp = null;
        var oldestTimestamp = 0;
        var lastTask = null;
        var updateInterval = setInterval(loadNewTasks, 17000);
        app.on("newtask", loadNewTasks);

        function loadNewTasks() {
            if (!element.isConnected) {
                clearInterval(updateInterval);
                app.unsubscribe("newtask", loadTasks);
            }

            api.getNewerTasks(params.taskStatus, newestTimestamp || 0, 25, function (response) {
                if (response.status === 200) {
                    var data = response.responseJSON;
                    for (var i = 0, len = data.tasks.length; i < len; i++) {
                        var item = fw.createElement(app, "task-list-item", Object.assign({ users: data.users }, data.tasks[i]));

                        newestTimestamp = data.tasks[i].created;

                        if (tagedNodes.list[0].childNodes.length === 0)
                            tagedNodes.list[0].appendChild(item);

                        tagedNodes.list[0].insertBefore(item, tagedNodes.list[0].childNodes[0]);
                    }
                }
            });
        }

        function loadTasks(cb) {
            api.getTasks(params.taskStatus, oldestTimestamp, 25, function (response) {
                var loaded = false;
                if (response.status === 200) {
                    var data = response.responseJSON;
                    loaded = !!data.tasks.length;
                    for (var i = 0, len = data.tasks.length; i < len; i++) {
                        var item = fw.createElement(app, "task-list-item", Object.assign({ users: data.users }, data.tasks[i]));

                        oldestTimestamp = data.tasks[i].created;
                        if (newestTimestamp === null)
                            newestTimestamp = data.tasks[i].created;

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