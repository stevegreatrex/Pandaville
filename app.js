var requirejs = require("requirejs");

requirejs.config({
    baseUrl: "src",
    nodeRequire: require
});

requirejs(["GameServer"], function(GameServer) {
    var server = new GameServer();
    server.worldAction("stevesvillage", "addBuilding", {
        name: "castle",
        size: { x: 5, y: 4 },
        position: { x: 3, y: 2 },
        cost: 10
    }).done(function(model) {
        console.log(JSON.stringify(model));
    })
    .fail(function(error) {
        console.log("Error: " + error);
    });
});