require(["../src/GameWorld"], function (GameWorld) {
    module("GameWorld");
    var
        //check that the specified model is the default
    isDefaultModel = function (model) {
        ok(model, "Model shouldn't be null");
        equal(model.money, 1000, "Should have startup cash");
        equal(model.xp, 0, "Should be zero xp");
        ok(model.size, "Should have a size");
        equal(model.size.x, 10, "Should start off 10x10");
        equal(model.size.y, 10, "Should start off 10x10");
        ok(model.buildings, "Should have an empty buildings array");
        equal(model.buildings.length, 0, "Should have an EMPTY buildings array");
    },
        //create a populated model
    createModel = function () {
        return {};
    };

    test("GameWorld is non-null", function () {
        ok(GameWorld, "GameWorld was not defined");
    });

    test("getModel returns an object when none is passed to the constructor", function () {
        var world = new GameWorld();
        isDefaultModel(world.getModel());
    });

    test("getModel returns constructor-specified model", function() {
        var model = createModel(),
            world = new GameWorld(model);

        equal(world.getModel(), model, "Should use constructor-specified model");
    });
});