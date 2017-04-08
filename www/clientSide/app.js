// import fw from "./framework/framework.js"

fw.defineComponent(
    "app",
    "/clientSide/app.html",
    "/clientSide/app.css",
    [
        {
            name: "task-list",
            uri: "clientSide/tasklist/tasklist.js"
        }
    ],
    function (element, childs, tagedNodes, params) {
    }
)