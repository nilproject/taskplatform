
function App() {
    "use strict";

    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    this.user = {
        avatarUri: "https://vk.com/images/stickers/61/64.png",
        fullName: "Big Boss"
    };

    function loadUserInfo(callback) {
        api.getUserInfo(function (response) {
            if (response.status === 200) {
                this.user = JSON.parse(response.responseText);
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        })
    }
    this.loadUserInfo = loadUserInfo;

    function authViaVk(callback) {
        api.authViaVk(function (response) {
            if (response.status === 200) {
                loadUserInfo(callback);
            } else {
                callback && callback(false);
            }
        });
    }
    this.authViaVk = authViaVk;
}