fw.defineComponent(
    "app-header",
    "./appheader.html",
    "./appheader.css",
    [
        {
            name: "new-task-dialog",
            uri: "../newtaskdialog/newtaskdialog.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.opened[0].onclick = function () {
            fw.navigation.navigate("/tasks", "Tasks");
        }
        tagedNodes.completed[0].onclick = function () {
            fw.navigation.navigate("/completedtasks", "Tasks");
        }
        tagedNodes.created[0].onclick = function () {
            fw.navigation.navigate("/createdtasks", "Tasks");
        }

        tagedNodes.avatar[0].src = app.user.avatarUrl;
        tagedNodes.name[0].innerText = app.user.name;
        tagedNodes.money[0].innerText = app.user.cash;

        app.on(
            app.events.cashUpdated,
            function () {
                app.updateCash(function () {
                    tagedNodes.money[0].innerText = app.user.cash;
                });
            },
            element)

        if (app.user.allowCreateTasks) {
            tagedNodes.newTask[0].onclick = function () {
                tagedNodes.newTaskDialog[0]._open();
            }
        } else {
            tagedNodes.newTask[0].parentNode.removeChild(tagedNodes.newTask[0]);
        }
    }
);