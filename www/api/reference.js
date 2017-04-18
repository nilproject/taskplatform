var api = {
    getUserInfo: function (callback) {
        $.ajax({
            url: "/api/getUserInfo.php",
            complete: callback,
            dataType: "json"
        });
    },

    authViaVk: function (userId, hash, callback) {
        $.ajax({
            url: "/api/authViaVk.php?userid=" + escape(userId) + "&hash=" + escape(hash),
            complete: callback,
            dataType: "json"
        });
    },

    createUser: function (vkUserId, hash, login, pass, role, name, callback) {
        $.ajax({
            url: "/api/createUser.php?vkuserid=" + escape(vkUserId) + "&hash=" + escape(hash) + "&login=" + escape(login) + "&pass=" + escape(pass) + "&role=" + escape(role) + "&name=" + escape(name),
            complete: callback,
            dataType: "json"
        });
    },

    createTask: function (description, reward, callback) {
        $.ajax({
            url: "/api/createTask.php",
            method: "POST",
            data: "description=" + escape(description) + "&reward=" + escape(reward),
            complete: callback,
            dataType: "json"
        });
    },

    getTasks: function (type, callback) {
        $.ajax({
            url: "/api/getTasks.php?type=" + escape(type),
            complete: callback,
            dataType: "json"
        });
    }
};