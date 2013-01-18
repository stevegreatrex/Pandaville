//taken from http://stackoverflow.com/questions/11439540/how-can-i-mock-dependencies-for-unit-testing-in-requirejs

define(["underscore", "jquery"], function (_, $) {
    var contextId = 0;

    function createContext(stubs) {
        var map = {};

        _.each(stubs, function (value, key) {
            var stubname = 'stub' + key;

            map[key] = stubname;
        });

        contextId += 1;
        var context = require.config($.extend(true, {}, require.sharedConfig, {
            context: contextId,
            map: {
                "*": map
            }
        }));

        _.each(stubs, function (value, key) {
            var stubname = 'stub' + key;

            define(stubname, function () {
                return value;
            });
        });

        return context;

    }

    return {
        createContext: createContext
    };
});