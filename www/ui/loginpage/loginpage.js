fw.defineComponent(
    "login-page",
    "./loginpage.html",
    "./loginpage.css",
    [],
    function (app, element, childs, tagedNodes, params) {

        var imageIndex = 0;
        var images = tagedNodes.imageSlot[0].getElementsByTagName("img");
        setInterval(function () {
            $(images[imageIndex]).removeClass("current");

            imageIndex++;
            imageIndex %= images.length;

            $(images[imageIndex]).addClass("current");
        }, 8000);
    }
);