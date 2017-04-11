fw.defineComponent(
    "app",
    "./app.html",
    "./app.css",
    [
        {
            name: "main-view",
            uri: "../mainview/mainview.js"
        },
        {
            name: "login-page",
            uri: "../loginpage/loginpage.js"
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