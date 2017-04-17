
function App() {
    "use strict";

    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    VK.init({ apiId: 5985022 });

    var self = this;
    self.user = {
    };

    function decodeHtml(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    };

    function loadUserInfo(callback) {
        api.getUserInfo(function (response) {
            if (response.status === 200) {
                self.user = response.responseJSON;
                self.user.Name = decodeHtml(self.user.Name);

                VK.Api.call('users.get', { user_ids: self.user.VkUserID, fields: "photo_100" }, function (r) {
                    if (r.response) {
                        self.user.avatarUrl = r.response[0].photo_100;
                    }
                    callback && callback(true);
                });
            } else {
                callback && callback(false);
            }
        });
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