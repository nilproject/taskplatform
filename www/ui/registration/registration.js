fw.defineComponent(
    "registration",
    "./registration.html",
    "./registration.css",
    [
        {
            name: "step0",
            uri: "./step0.js"
        },
        {
            name: "step1",
            uri: "./step1.js"
        },
        {
            name: "step2",
            uri: "./step2.js"
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        var stepIndex = 0;

        function final() {

        }

        function goToNext() {
            if (tagedNodes.steps[stepIndex]._validate) {
                $(tagedNodes.nextBtn[0]).attr("disabled", "disabled");
                tagedNodes.steps[stepIndex]._validate(function (result) {
                    if (result) {
                        $(tagedNodes.nextBtn[0]).removeAttr("disabled");
                        _go();
                    }
                });
            } else {
                _go();
            }

            function _go() {
                if (stepIndex >= tagedNodes.steps.length - 1) {
                    final();
                    return;
                }

                $(tagedNodes.steps[stepIndex]).removeClass("current");
                $(tagedNodes.steps[stepIndex]).addClass("visited");
                stepIndex++;
                $(tagedNodes.steps[stepIndex]).addClass("current");
                $(tagedNodes.nextBtn[0]).removeClass("hidden");
                $(tagedNodes.backBtn[0]).removeClass("hidden");

                if (stepIndex === tagedNodes.steps.length - 1) {
                    tagedNodes.nextBtn[0].innerText = "Готово";
                } else {
                    tagedNodes.nextBtn[0].innerText = "Далее";
                }
            }
        }

        function goToPrev() {
            if (stepIndex <= 0)
                return;

            $(tagedNodes.steps[stepIndex]).removeClass("current");
            stepIndex--;
            $(tagedNodes.steps[stepIndex]).removeClass("visited");
            $(tagedNodes.steps[stepIndex]).addClass("current");
            $(tagedNodes.nextBtn[0]).removeClass("hidden");

            if (stepIndex === 0)
                $(tagedNodes.backBtn[0]).addClass("hidden");
            tagedNodes.nextBtn[0].innerText = "Далее";
        }

        tagedNodes.nextBtn[0].onclick = goToNext;
        tagedNodes.backBtn[0].onclick = goToPrev;

        $(tagedNodes.steps[0]).click(goToNext);
        tagedNodes.steps[1].onchange = function () {
            $(tagedNodes.nextBtn[0]).removeAttr("disabled");
        }
    }
);