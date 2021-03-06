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

    getNewerTasks: function (type, timeoffset, limit, callback) {
        $.ajax({
            url: "/api/getNewerTasks.php?type=" + escape(type) + "&time=" + escape(timeoffset) + "&limit=" + escape(limit),
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
    },

    enrollFunds: function (amount, callback) {
        $.ajax({
            url: "/api/enrollFunds.php",
            method: "POST",
            data: "amount=" + escape(amount),
            complete: callback,
            dataType: "json"
        });
    },

    cancelRegistration: function (callback) {
        $.ajax({
            url: "/api/cancelRegistration.php",
            method: "DELETE",
            complete: callback,
            dataType: "json"
        });
    },

    getCommission: function (callback) {
        $.ajax({
            url: "/api/getCommission.php",
            complete: callback,
            dataType: "json"
        });
    },

    setCommission: function (commission, token, callback) {
        $.ajax({
            url: "/api/setCommission.php",
            method: "POST",
            data: "commission=" + escape(commission) + "&token=" + escape(token),
            complete: callback,
            dataType: "json"
        });
    },

    getSystemCash: function (token, callback) {
        $.ajax({
            url: "/api/getSystemCash.php?token=" + escape(token),
            complete: callback,
            dataType: "json"
        });
    },

    getTransactions: function (timeoffset, limit, token, callback) {
        $.ajax({
            url: "/api/getTransactions.php?time=" + escape(timeoffset) + "&limit=" + escape(limit) + "&token=" + escape(token),
            complete: callback,
            dataType: "json"
        });
    },

    getNewerTransactions: function (timeoffset, limit, token, callback) {
        $.ajax({
            url: "/api/getNewerTransactions.php?time=" + escape(timeoffset) + "&limit=" + escape(limit) + "&token=" + escape(token),
            complete: callback,
            dataType: "json"
        });
    }
};