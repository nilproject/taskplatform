fw.defineComponent(
    "step1",
    "./step1.html",
    "./step1.css",
    [],
    function (app, element, childs, tagedNodes, params) {

        function validateField(field, condition) {
            if (condition) {
                $(field).removeClass("invalid");
                return true;
            } else {
                $(field).addClass("invalid");
                return false;
            }
        }

        function onChangeHandler() {
            if (element.onchange) {
                try {
                    element.onchange();
                } catch (e) {
                }
            }
        }

        tagedNodes.login[0].onchange = onChangeHandler;
        tagedNodes.pass[0].onchange = onChangeHandler;
        tagedNodes.confirmPass[0].onchange = onChangeHandler;
        tagedNodes.name[0].onchange = onChangeHandler;

        // HTML5
        tagedNodes.login[0].oninput = onChangeHandler;
        tagedNodes.pass[0].oninput = onChangeHandler;
        tagedNodes.confirmPass[0].oninput = onChangeHandler;
        tagedNodes.name[0].oninput = onChangeHandler;

        VK.Api.call('users.get', { user_ids: VK.Auth.getSession().mid }, function (r) {
            if (r.response) {
                tagedNodes.name[0].value = r.response[0].first_name + " " + r.response[0].last_name;
            }
        });

        element._validateAndSave = function (callback) {
            var valid = true;

            var isLoginExists = tagedNodes.login[0].value.length;
            valid &= validateField(tagedNodes.login[0], !isLoginExists || /^[\w\d_]*$/.test(tagedNodes.login[0].value));

            valid &= validateField(tagedNodes.pass[0], !isLoginExists || tagedNodes.pass[0].value.length !== 0);
            valid &= validateField(tagedNodes.confirmPass[0], !isLoginExists || tagedNodes.pass[0].value === tagedNodes.confirmPass[0].value)

            valid &= validateField(tagedNodes.name[0], /^[\w\d_'\sА-я]+$/.test(tagedNodes.name[0].value));

            if (valid) {
                element._info = {
                    login: tagedNodes.login[0].value,
                    pass: tagedNodes.pass[0].value,
                    name: tagedNodes.name[0].value
                };
            }

            callback && callback(valid);
        }
    }
);