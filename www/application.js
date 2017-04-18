
function App() {
    "use strict";

    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    VK.init({ apiId: 5985022 });

    var self = this;
    self.vkUsersCache = {};
    self.vkUsersAwaiters = {};
    self.user = {};

    this.decodeHtml = decodeHtml;
    function decodeHtml(str) {
        return unescape(str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        }));
    };

    this.loadUserInfo = loadUserInfo;
    function loadUserInfo(callback) {
        api.getUserInfo(function (response) {
            if (response.status === 200) {
                self.user = response.responseJSON;
                self.user.name = decodeHtml(self.user.name);

                self.user.allowCreateTasks = self.user.role === "Customer";
                self.user.allowExecuteTasks = self.user.role === "Executor";
                self.user.isSystem = self.user.role === "System";

                VK.Api.call(
                    'users.get',
                    {
                        user_ids: self.user.vkUserId,
                        fields: "photo_100"
                    },
                    function (r) {
                        if (r.response) {
                            self.vkUsersCache[self.user.vkUserId] = r.response[0];
                            self.user.avatarUrl = r.response[0].photo_100;
                        }

                        callback && callback(true);
                    });
            } else {
                callback && callback(false);
            }
        });
    }

    this.authViaVk = authViaVk;
    function authViaVk(callback) {
        api.authViaVk(function (response) {
            if (response.status === 200) {
                loadUserInfo(callback);
            } else {
                callback && callback(false);
            }
        });
    }

    this.getVkUser = getVkUser;
    function getVkUser(userId, callback) {
        if (self.vkUsersCache[userId]) {
            callback && callback(self.vkUsersCache[userId]);
        } else {
            if (self.vkUsersAwaiters[userId]) {
                callback && self.vkUsersAwaiters[userId].push(callback);
            } else {
                if (callback)
                    self.vkUsersAwaiters[userId] = [callback];

                VK.Api.call(
                    'users.get',
                    {
                        user_ids: self.user.vkUserId,
                        fields: "photo_100"
                    },
                    function (r) {
                        if (r.response) {
                            self.vkUsersCache[self.user.vkUserId] = r.response[0];
                            for (var cb in self.vkUsersAwaiters[userId]) {
                                cb(r.response[0]);
                            }
                        }
                    });
            }
        }
    }
}