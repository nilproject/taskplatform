fw.defineComponent(
    "step0",
    "./step0.html",
    "./step0.css",
    [],
    function (app, element, childs, tagedNodes, params) {
        function clickHandler() {
            $(tagedNodes.customer[0]).removeClass("current");
            $(tagedNodes.executor[0]).removeClass("current");

            $(this).addClass("current");

            element._info = { role: this.attributes.getNamedItem("fw-tag").value };
        }

        tagedNodes.customer[0].onclick = clickHandler;
        tagedNodes.executor[0].onclick = clickHandler;
    }
);