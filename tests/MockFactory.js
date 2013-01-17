//taken from http://stackoverflow.com/questions/11439540/how-can-i-mock-dependencies-for-unit-testing-in-requirejs

define(["underscore"], function (_) {
   function createContext(stubs) {
      var map = {};

      _.each(stubs, function (value, key) {
        var stubname = 'stub' + key;

        map[key] = stubname;
      });


      var context = require.config({
        baseUrl: "../src", //todo: find a way to pull this from require configuration
        context: Math.floor(Math.random() * 1000000),
        map: {
          "*": map
        }
      });

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