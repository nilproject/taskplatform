fw.defineComponent(
    "login-page",
    "./loginpage.html",
    "./loginpage.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        VK.Widgets.Auth("vk_auth", {
            onAuth: function (data) {
                api.authViaVk(data.uid, data.hash, function (response) {
                    if (response.status === 200) {
                        fw.navigation.navigate("/");
                    } else if (response.status === 403) {
                        fw.navigation.navigate("/registration?hash=" + data.hash);
                    }
                });
            }
        });

        var imageIndex = 0;
        var images = tagedNodes.imageSlot[0].getElementsByTagName("img");
        setInterval(function () {
            $(images[imageIndex]).removeClass("current");

            imageIndex++;
            imageIndex %= images.length;

            $(images[imageIndex]).addClass("current");
        }, 8000);

        images[0].onload = function () {
            var imagesUrls = [
                "ui/assets/2.jpg",
                "ui/assets/3.jpg"
            ];

            for (var i = 0, len = imagesUrls.length; i < len; i++) {
                var img = document.createElement("img");
                img.className = "minWidth backimg";
                img.src = imagesUrls[i];
                tagedNodes.imageSlot[0].appendChild(img);
            }

            images = tagedNodes.imageSlot[0].getElementsByTagName("img");
        };
    }
);