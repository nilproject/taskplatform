fw.defineComponent(
    "task-list-item",
    "./taskListItem.html",
    "./taskListItem.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        tagedNodes.text[0].innerText = app.decodeHtml(params.description);
        tagedNodes.time[0].innerText = Date(params.created);
        tagedNodes.reward[0].innerText = params.reward;

        tagedNodes.name[0].innerText = app.decodeHtml(params.users[params.creatorId].name);

        app.getVkUser(params.users[params.creatorId].vkUserId, function (user) {
            tagedNodes.avatar[0].src = user.photo_100;
        });

        if (app.user.allowExecuteTasks) {
            tagedNodes.doButton[0].onclick = function () {

            }
        } else {
            tagedNodes.doButton[0].parentNode.removeChild(tagedNodes.doButton[0]);
        }
    }
)