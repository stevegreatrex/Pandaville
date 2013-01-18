require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "underscore": "../scripts/underscore.min",
        "knockout": "../scripts/knockout-2.2.1",
        "knockout.mapping": "../scripts/knockout.mapping-latest"
    },
    map: {
        "*": {
            "jquery-deferred": "jquery"
        }
    },
    shim: {
        "underscore": { exports: "_" },
        "knockout": { exports: "ko" },
        "knockout.mapping": ["knockout"]
    }
});


require(["jquery", "knockout", "GameWorldViewModel"], function ($, ko, GameWorldViewModel) {
    $(function() {
        $("h1").fadeOut(1000);
    });
});