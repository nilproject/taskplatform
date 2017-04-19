
function App() {
    "use strict";

    if (!(this instanceof App))
        throw new TypeError("Invalid constructor call");

    VK.init({ apiId: 5985022 });

    var self = this;
    self.user = {};

    var vkUsersCache = {};
    var vkUsersAwaiters = {};
    var events = {};

    this.on = on;
    function on(event, handler) {
        if (typeof handler !== "function")
            return;

        if (!(event in events))
            events[event] = [];

        events[event].push(handler);
    }

    this.unsubscribe = unsubscribe;
    function unsubscribe(event, handler) {
        if (typeof handler !== "function")
            return;

        if (!(event in events))
            return;

        events[event].splice(events[event].findIndex(handler), 1);
    }

    this.fireEvent = fireEvent;
    function fireEvent(event) {
        if (!(event in events))
            return;

        setTimeout(function () {
            for (var cb in events[event]) {
                try {
                    events[event][cb]();
                } catch (e) { }
            }
        });
    }

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
                            vkUsersCache[self.user.vkUserId] = r.response[0];
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
        if (vkUsersCache[userId]) {
            callback && callback(vkUsersCache[userId]);
        } else {
            if (vkUsersAwaiters[userId]) {
                callback && vkUsersAwaiters[userId].push(callback);
            } else {
                if (callback)
                    vkUsersAwaiters[userId] = [callback];

                VK.Api.call(
                    'users.get',
                    {
                        user_ids: userId,
                        fields: "photo_100"
                    },
                    function (r) {
                        if (r.response) {
                            vkUsersCache[userId] = r.response[0];
                            for (var cb in vkUsersAwaiters[userId]) {
                                try {
                                    vkUsersAwaiters[userId][cb](r.response[0]);
                                } catch (e) { }
                            }

                            delete vkUsersAwaiters[userId];
                        }
                    });
            }
        }
    }

    Object.seal(this);
}