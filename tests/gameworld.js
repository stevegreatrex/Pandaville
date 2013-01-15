require(["../src/GameWorld"], function (GameWorld) {
    module("GameWorld");
    var isEmptyModel = function (model) {
        ok(model, "Model shouldn't be null");
        equal(model.money, 0, "Should be zero money");
        equal(model.xp, 0, "Should be zero xp");
        ok(model.buildings, "Should have an empty buildings array");
        equal(model.buildings.length, 0, "Should have an EMPTY buildings array");
    };

    test("GameWorld is non-null", function () {
        ok(GameWorld, "GameWorld was not defined");
    });

    test("getModel returns an object when none is passed to the constructor", function () {
        var world = new GameWorld();
        isEmptyModel(world.getModel());
    });
});