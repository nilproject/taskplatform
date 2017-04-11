fw.defineComponent(
    "main-view",
    "./mainview.html",
    "./mainview.css",
    [
        {
            name: "task-list",
            uri: "../tasklist/tasklist.js"
        },
        {
            name: "app-header",
            uri: "../appheader/appheader.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
    }
);