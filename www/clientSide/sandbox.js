fw.defineComponent(
    "x-first",
    "data:text/html,<div fw-tag=\"first\"></div><x-second></x-second>",
    "",
    [],
    function (element, childs, tagedNodes, params) {
        console.log(tagedNodes);
    }
);

fw.defineComponent(
    "x-second",
    "data:text/html,<div fw-tag=\"second\"></div>",
    "",
    [],
    function (app, element, childs, tagedNodes, params) {
    }
);