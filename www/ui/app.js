// import fw from "./framework/framework.js"

fw.defineComponent(
    "app",
    "./app.html",
    "./app.css",
    [
        {
            name: "task-list",
            uri: "./tasklist/tasklist.js"
        },
        {
            name: "app-header",
            uri: "./appheader/appheader.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
    }
);

function App() {
    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    this.user = {
        avatarUri: "https://vk.com/images/stickers/61/64.png",
        fullName: "Big Boss"
    };
}