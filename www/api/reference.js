var api = {
    getUserInfo: function (callback) {
        $.ajax({
            url: "/api/getUserInfo.php",
            complete: callback,
            dataType: "text"
        });
    },

    getUserInfoByVkId: function (userId, hash, callback) {
        $.ajax({
            url: "/api/authViaVk.php?userid=" + userId + "&hash=" + hash,
            complete: callback,
            dataType: "text"
        });
    }
};