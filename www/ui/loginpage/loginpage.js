fw.defineComponent(
    "login-page",
    "./loginpage.html",
    "./loginpage.css",
    [
        {
            uri: "//vk.com/js/api/openapi.js?144"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        VK.init({ apiId: 5985022 });

        var imageIndex = 0;
        var images = tagedNodes.imageSlot[0].getElementsByTagName("img");
        setInterval(function () {
            $(images[imageIndex]).removeClass("current");

            imageIndex++;
            imageIndex %= images.length;

            $(images[imageIndex]).addClass("current");
        }, 8000);

        VK.Widgets.Auth("vk_auth", {
            onAuth: function (data) {
                alert('user ' + data['uid'] + ' authorized');
            }
        });

        setTimeout(function () {
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
        }, 3400);
    }
);