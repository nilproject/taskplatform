// import fw from "./framework/framework.js"

fw.defineComponent(
    "app",
    "./app.html",
    "./app.css",
    [
        {
            name: "task-list",
            uri: "clientSide/tasklist/tasklist.js"
        },
        {
            name: "app-header",
            uri: "clientSide/appheader/appheader.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
    }
);