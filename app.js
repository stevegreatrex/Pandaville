var requirejs = require("requirejs");

requirejs.config({
    baseUrl: "src",
    nodeRequire: require
});

requirejs(["GameServer", "express", "config", "errors"], function(GameServer, express, config, errors) {
    var server = new GameServer(),
        app = express();

    app.use(express.bodyParser());

    app.post("/:worldId/:worldAction", function (req, res) {
        if (config.server.logLevel === "verbose") {
            console.log("Processing " + req.url);
        }
        server.worldAction(req.params.worldId, req.params.worldAction, req.body)
            .fail(function (error, model) {

                console.log("[" + req.url + "] Error :" + error);

                if (error === errors.modelNotFound) {
                    res.send(404);
                } else {
                    res.json(500, model);
                }
                res.end();
            })
            .done(function (model) {
                if (config.server.logLevel === "verbose") {
                    console.log("Completed " + req.url);
                }
                res.json(200, model);
                res.end();
            });
    });

    app.listen(config.server.port);
    console.log("server started");
});