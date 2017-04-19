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

    createUser: function (vkUserId, hash, role, name, callback) {
        $.ajax({
            url: "/api/createUser.php?vkuserid=" + escape(vkUserId) + "&hash=" + escape(hash) + "&role=" + escape(role) + "&name=" + escape(name),
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

    getTasks: function (type, timeoffset, limit, callback) {
        $.ajax({
            url: "/api/getTasks.php?type=" + escape(type) + "&time=" + escape(timeoffset) + "&limit=" + escape(limit),
            complete: callback,
            dataType: "json"
        });
    },

    completeTask: function (taskId, callback) {
        $.ajax({
            url: "/api/completeTask.php?taskid=" + escape(taskId),
            complete: callback,
            dataType: "json"
        });
    }
};