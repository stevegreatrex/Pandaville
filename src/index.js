require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "underscore": "../scripts/underscore.min",
        "knockout": "../scripts/knockout-2.2.1",
        "knockout.mapping": "../scripts/knockout.mapping-latest",
        "bootstrap": "../scripts/bootstrap.min",
        "command": "../scripts/command",
        "kinetic": "../scripts/kinetic-v4.3.1"
    },
    map: {
        "*": {
            "jquery-deferred": "jquery"
        }
    },
    shim: {
        "underscore": { exports: "_" },
        "knockout": { exports: "ko" },
        "kinetic": { exports: "Kinetic" },
        "knockout.mapping": ["knockout"],
        "bootstrap": ["jquery"],
        "command": ["knockout"]
    }
});


require(["jquery", "knockout", "GameWorldViewModel", "ServerApi", "WorldRenderer"], function ($, ko, GameWorldViewModel, ServerApi, WorldRenderer) {
    $(function () {
        var $content = $("#body-content"),
            loadWorld = function (worldId) {
                var worldUrl = "/world/" + worldId;

                $.get("/world.html")
                    .done(function (html) {
                        $content.html(html);
                        var api = new ServerApi(worldId);

                        api.getModel().done(function(model) {
                            var viewModel = new GameWorldViewModel(worldId, api, model),
                                renderer = new WorldRenderer(viewModel);

                            ko.applyBindings(viewModel, $content[0]);
                        });
                            

                        

                    });
            };

        if (window.options && window.options.worldId) {
            loadWorld(window.options.worldId);
        } else {
            $.get("/home.html").done(function (html) {
                $content.html(html);
            });
        }
    });
});