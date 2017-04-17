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
            url: "/api/authViaVk.php?userid=" + userId + "&hash=" + hash,
            complete: callback,
            dataType: "json"
        });
    },

    createUser: function (vkUserId, hash, login, pass, role, name, callback) {
        $.ajax({
            url: "/api/createUser.php?vkuserid=" + vkUserId + "&hash=" + hash + "&login=" + escape(login) + "&pass=" + escape(pass) + "&role=" + role + "&name=" + escape(name),
            complete: callback,
            dataType: "json"
        });
    },

    createTask: function (description, reward, callback) {
        $.ajax({
            url: "/api/createTask.php",
            method: "POST",
            data: "description=" + escape(description) + "&reward=" + reward,
            complete: callback,
            dataType: "json"
        });
    }
};