fw.defineComponent(
    "task-list-item",
    "./taskListItem.html",
    "./taskListItem.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.text[0].innerText = app.decodeHtml(params.description);
        tagedNodes.time[0].innerText = new Date(+params.created);
        tagedNodes.reward[0].innerText = params.reward;

        tagedNodes.name[0].innerText = app.decodeHtml(params.users[params.creatorId].name);

        if (params.status === "Done") {
            $(element).addClass("completed");
        }

        app.getVkUser(params.users[params.creatorId].vkUserId, function (user) {
            tagedNodes.avatar[0].src = user.photo_100;
        });

        if (app.user.allowExecuteTasks
            && (params.status === "ToDo"
                || (params.status === "Assigned" && params.executorId === app.user.userId))) {

            tagedNodes.doButton[0].onclick = function () {
                $(tagedNodes.doButton[0]).attr("disabled", "disabled");
                api.completeTask(params.taskId, function () {
                    element.parentNode.removeChild(element);
                });
            }
        } else {
            tagedNodes.doButton[0].parentNode.removeChild(tagedNodes.doButton[0]);
        }
    }
)