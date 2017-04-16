
function App() {
    "use strict";

    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    this.user = {
        avatarUri: "https://vk.com/images/stickers/61/64.png",
        fullName: "Big Boss"
    };

    this.loadUserInfo = function (callback) {
        api.getUserInfo(function (response) {
            if (response.status === 200) {
                console.log(response);
                this.user = JSON.parse(response.responseText);
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        })
    }
}