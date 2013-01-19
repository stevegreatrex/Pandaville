var requirejs = require("requirejs");

requirejs.config({
    baseUrl: "src",
    nodeRequire: require
});

requirejs(["GameServer", "express", "config", "errors", "fs"], function(GameServer, express, config, errors, fs) {
    var server = new GameServer(),
        app = express();

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



    app.post("/world/:worldId/:worldAction", function (req, res) {
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

    app.get("/", function(req, res) {
        res.render("index.html");
    });

    app.get("/:worldId", function(req, res) {
        res.render("index.html", {
            worldId: req.params.worldId
        });
    });

    app.listen(config.server.port);
    console.log("server started");
});