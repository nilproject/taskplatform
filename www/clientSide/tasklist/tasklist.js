fw.defineComponent(
    "task-list",
    "./tasklist.html",
    "./tasklist.css",
    [
        {
            name: "task-list-item",
            uri: "/clientSide/tasklist/taskListItem.js",
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        fw.prefetchComponent("task-list-item", function () {
            for (var i = 0; i < 10; i++) {
                tagedNodes.list[0].appendChild(fw.createElement(app, "task-list-item", {
                    text: `Lorem ipsum dolor sit amet, dicant volumus democritum ad qui, vim possit dolorem suavitate in, pri eros aliquid volumus ne. Quando tamquam per ei, ex inermis noluisse mel, primis noster usu no. Quod discere disputando ex nam, partem scribentur ea qui. Facete intellegat ea cum, ad cum propriae vulputate comprehensam, animal fuisset democritum eos an. Mea ex labitur facilisi repudiare, aeque quaestio ex sit. Sonet labitur perpetua ne vix, ea has rebum inermis, et ipsum legendos rationibus cum.`
                }));
            }
        });
    }
)