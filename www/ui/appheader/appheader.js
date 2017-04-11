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

        tagedNodes.avatar[0].src = app.user.avatarUri;
        tagedNodes.name[0].innerText = app.user.fullName;

        tagedNodes.newTask[0].onclick = function () {
            $(tagedNodes.newTaskDialog[0]).removeClass("hidden");
        }
    }
);