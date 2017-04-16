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
        },
        {
            name: "registration",
            uri: "../registration/registration.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
    }
);
