require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "underscore": "../scripts/underscore.min",
        "knockout": "../scripts/knockout-2.2.1",
        "knockout.mapping": "../scripts/knockout.mapping-latest",
        "bootstrap": "../scripts/bootstrap.min"
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
    }
});


require(["jquery", "knockout", "GameWorldViewModel"], function ($, ko, GameWorldViewModel) {
    $(function () {
        var $content = $("#body-content");

        if (window.options && window.options.worldId) {
            var worldId  = window.options.worldId,
                worldUrl = "/world/" + worldId;
            $.get("/world.html")
                .done(function(html) {
                    $content.html(html);
                    ko.applyBindings(new GameWorldViewModel(worldId), $content[0]);
                });
        } else {
            $.get("/home.html")
                .done(function(html) {
                    $content.html(html);
                });
        }
    });
});