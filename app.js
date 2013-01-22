var requirejs = require("requirejs");

requirejs.config({
    baseUrl: "src",
    nodeRequire: require
});

requirejs(["GameServer", "express", "config", "Error", "underscore", "fs"], function(GameServer, express, config, Error, _, fs) {
    var server = new GameServer(),
        app = express(),
        returnErrorAndModel = function (res, error, model) {
             if (Error.isModelNotFound(error)) {
                res.send(404);
            } else {
                res.json(500, model);
            }
            res.end();
        },
        returnModel = function (res, model) {
            res.json(200, model);
            res.end();
        };

    app.use(express.bodyParser());
    app.configure(function() {
        app.use("/content", express.static(__dirname + "/content"));
        app.use("/scripts", express.static(__dirname + "/scripts"));
        app.use("/src", express.static(__dirname + "/src"));
        app.use(express.static(__dirname + "/views"));

        // disable layout
        app.set("view options", {layout: false});

        // make a custom html template
        app.engine('.html', function(path, options, fn) {
            fs.readFile(path, "utf8", function(err, str) {
                fn(null, str + "<script>window.options = " + JSON.stringify(options) + ";</script>");
            });
        });
    });

    app.get("/world/:worldId", function (req, res) {
         server.getModel(req.params.worldId)
            .fail(_.bind(returnErrorAndModel, null, res))
            .done(_.bind(returnModel, null, res));
    });

    app.post("/world/:worldId/:worldAction", function (req, res) {
        server.worldAction(req.params.worldId, req.params.worldAction, req.body)
            .fail(_.bind(returnErrorAndModel, null, res))
            .done(_.bind(returnModel, null, res));
    });

    app.get("/:worldId", function(req, res) {
        res.render("index.html", {
            worldId: req.params.worldId
        });
    });

    app.listen(config.server.port);
    console.log("server started");
});