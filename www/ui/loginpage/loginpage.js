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
    }
);