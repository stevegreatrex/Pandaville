require.sharedConfig = {
    baseUrl: "../src",
    paths: {
        "jquery": "../scripts/jquery-1.8.3.min",
        "sinon": "../scripts/sinon-1.5.2",
        "underscore": "../scripts/underscore.min",
        "MockFactory": "../tests/MockFactory",
        "knockout": "../scripts/knockout-2.2.1",
        "knockout.mapping": "../scripts/knockout.mapping-latest",
        "command": "../scripts/command"
    },
    map: {
        "*": {
            "jquery-deferred": "jquery"
        }
    },
    shim: {
        "sinon": { exports: "sinon" },
        "underscore": { exports: "_" }
    },
    deps: ["jquery"]
};
require.config(require.sharedConfig);

QUnit.config.autostart = false;

require([
    "../tests/TestGameWorld",
    "../tests/TestGameWorldAction",
    "../tests/TestGameServer",
    "../tests/TestDataSource",
    "../tests/TestServerApi",
    "../tests/TestGameWorldViewModel"
    ], QUnit.start);