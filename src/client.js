require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "underscore": "../scripts/underscore.min"
    },
    map: {
        "*": {
            "jquery-deferred": "jquery"
        }
    },
    shim: {
        "underscore": { exports: "_" }
    }
});


require(["jquery"], function ($) {
    $(function() {
        $("h1").fadeOut(5000);
    });
});