﻿fw.defineComponent(
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
            var queryPrms = app.getQueryParams();
            var uid = VK.Auth.getSession().mid;
            var hash = queryPrms.hash;

            var data = { uid: uid, hash: hash };
            Object.assign(data, tagedNodes.steps[0]._info);
            Object.assign(data, tagedNodes.steps[1]._info);

            api.createUser(data.uid, data.hash, data.role, data.name, function (response) {
                if (response.status === 200) {
                    if (response.responseJSON.result === "success") {
                        api.authViaVk(data.uid, data.hash, function (response) {
                            if (response.status === 200) {
                                window.location.href = window.location.origin;
                            } else if (response.status === 403) {
                                // TODO будет странно, если в конце регистрации система попросит ещё раз зарегистрироваться
                                // надо будет что-то придумать на этот случай
                            }
                        });
                    } else {
                        // TODO показать ошибку пользователю
                        console.error(response.responseJSON);
                    }
                }
            });
        }

        function goToNext() {
            if (tagedNodes.steps[stepIndex]._validateAndSave) {
                $(tagedNodes.nextBtn[0]).attr("disabled", "disabled");
                tagedNodes.steps[stepIndex]._validateAndSave(function (result) {
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

                $(tagedNodes.nextBtn[0]).removeAttr("disabled");

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

            $(tagedNodes.nextBtn[0]).removeAttr("disabled");

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