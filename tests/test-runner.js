require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
    },
    deps: ["jquery"]
});

QUnit.config.autostart = false;

require([
    "../tests/TestGameWorld",
    "../tests/TestGameWorldAction"
    ], QUnit.start);