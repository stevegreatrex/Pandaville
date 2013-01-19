require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "underscore": "../scripts/underscore.min",
        "knockout": "../scripts/knockout-2.2.1",
        "knockout.mapping": "../scripts/knockout.mapping-latest",
        "bootstrap": "../scripts/bootstrap.min",
        "command": "../scripts/command"
    },
    map: {
        "*": {
            "jquery-deferred": "jquery"
        }
    },
    shim: {
        "underscore": { exports: "_" },
        "knockout": { exports: "ko" },
        "knockout.mapping": ["knockout"],
        "bootstrap": ["jquery"],
        "command": ["knockout"]
    }
});


require(["jquery", "knockout", "GameWorldViewModel", "ServerApi"], function ($, ko, GameWorldViewModel, ServerApi) {
    $(function () {
        var $content = $("#body-content"),
            loadWorld = function (worldId) {
                var worldUrl = "/world/" + worldId;

                $.get("/world.html")
                    .done(function (html) {
                        $content.html(html);
                        var api = new ServerApi(worldId);
                        ko.applyBindings(new GameWorldViewModel(worldId, api), $content[0]);
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