require.config({
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "sinon": "../scripts/sinon-1.5.2",
        "underscore": "../scripts/underscore.min",
        "MockFactory": "../tests/MockFactory"
    },
    shim: {
        "sinon": { exports: "sinon" },
        "underscore": { exports: "_" }
    },
    deps: ["jquery"]
});

QUnit.config.autostart = false;

require([
    "../tests/TestGameWorld",
    "../tests/TestGameWorldAction",
    "../tests/TestGameServer",
    ], QUnit.start);