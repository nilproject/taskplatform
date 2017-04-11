fw.defineComponent(
    "task-list",
    "./tasklist.html",
    "./tasklist.css",
    [
        {
            name: "task-list-item",
            uri: "./taskListItem.js",
        }
    ],
    function (app, element, childs, tagedNodes, params) {
        fw.prefetchComponent("task-list-item", function () {
            for (var i = 0; i < 10; i++) {
                tagedNodes.list[0].appendChild(fw.createElement(app, "task-list-item", {
                    text: params.tasksType + " " + i + "\n" + "Lorem ipsum dolor sit amet, in iuvaret inimicus laboramus nam, id cum tritani reprehendunt, sed posse percipitur ea. Nec eros vero ut, ut probo forensibus his. Reque quando veritus an has, mei ei quodsi constituam, erant omnium sanctus et mel. Nemore veritus mei ut. Principes adipiscing per no, ne timeam alienum qui. Oratio denique voluptua te duo, ad rebum altera dolorum eum. Vel ex dolore everti copiosae, sea quis amet abhorreant an."
                }));
            }
        });
    }
)