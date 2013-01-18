var requirejs = require("requirejs");

requirejs.config({
    baseUrl: "src",
    nodeRequire: require
});

requirejs(["GameServer"], function(GameServer) {
    var server = new GameServer();
    server.worldAction("stevesvillage", "addBuilding", {
        name: "hut",
        size: { x: 1, y: 1 },
        position: { x: 1, y: 1 },
        cost: 1
    }).done(function(model) {
        console.log(JSON.stringify(model, null, 4));
    })
    .fail(function(error, model) {
        console.log("Error: " + error);
        console.log(JSON.stringify(model, null, 4));
    });
});