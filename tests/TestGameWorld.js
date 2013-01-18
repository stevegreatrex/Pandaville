require(["jquery", "GameWorld"], function ($, GameWorld) {
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
        //create a populated gameworld model
        createModel = function (opts) {
            return $.extend(true, {
                size: { x: 10, y: 10 },
                buildings: []
            }, opts);
        },
        //create a populated building
        createBuilding = function (opts) {
            return $.extend(true, {
                cost: 0,
                size: { x: 1, y: 1 },
                position: { x: 1, y: 1 }
            }, opts);
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

    test("addBuilding cannot execute with no building", function () {
        var world = new GameWorld();

        ok(!world.addBuilding.canExecute(), "Should not be able to execute with a null building");
    });

    test("addBuilding cannot execute when specified building costs more than balance", function() {
        var model = createModel({ money: 100 }),
            world = new GameWorld(model),
            building = createBuilding({ cost: 101 });

        ok(!world.addBuilding.canExecute(building), "Building is too expensive");
    });

    test("addBuilding cannot execute when specified building doesn't fit", function () {
        var model                = createModel(),
            world                = new GameWorld(model),
            outOfBoundsNegativeX = createBuilding({ position: { x: -1, y: 0 } }),
            outOfBoundsNegativeY = createBuilding({ position: { x: 0, y: -1 } }),
            outOfBoundsX         = createBuilding({ position: { x: 10, y: 1 } }),
            outOfBoundsY         = createBuilding({ position: { x: 1, y: 10 } }),
            tooBigX              = createBuilding({ position: { x: 3, y: 1 }, size: { x: 8, y: 1 } }),
            tooBigY              = createBuilding({ position: { x: 1, y: 3 }, size: { x: 1, y: 8 } });

        ok(!world.addBuilding.canExecute(outOfBoundsNegativeX), "Out of bounds - negative X position");
        ok(!world.addBuilding.canExecute(outOfBoundsNegativeY), "Out of bounds - negative Y position");
        ok(!world.addBuilding.canExecute(outOfBoundsX), "Out of bounds - too large X position");
        ok(!world.addBuilding.canExecute(outOfBoundsY), "Out of bounds - too large Y position");
        ok(!world.addBuilding.canExecute(tooBigX), "Out of bounds - too big in X direction");
        ok(!world.addBuilding.canExecute(tooBigY), "Out of bounds - too big in Y direction");
    });

    test("addBuilding cannot execute when specified building overlaps an existing one", function () {
        var model = createModel({
                money: 1000,
                buildings: [
                    {
                        position: { x: 2, y: 2 },
                        size: { x: 3, y: 3 }
                    }
                ]
            }),
            world                    = new GameWorld(model),
            fullyWithin              = createBuilding({ position: { x: 3, y: 3 }, size: { x: 1, y: 1 } }),
            overlapFromAbove         = createBuilding({ position: { x: 3, y: 1 }, size: { x: 1, y: 3 } }),
            overlapFromSide          = createBuilding({ position: { x: 1, y: 3 }, size: { x: 3, y: 1 } }),
            startFromWithin          = createBuilding({ position: { x: 3, y: 3 }, size: { x: 5, y: 5 } }),
            overlapEntirelyFromAbove = createBuilding({ position: { x: 3, y: 1 }, size: { x: 1, y: 5 } }),
            overlapEntirelyFromSide  = createBuilding({ position: { x: 1, y: 3 }, size: { x: 5, y: 1 } }),
            sameSizeAndPosition      = createBuilding({ position: { x: 2, y: 2 }, size: { x: 3, y: 3 } });

        ok(!world.addBuilding.canExecute(fullyWithin), "Fully within another building");
        ok(!world.addBuilding.canExecute(overlapFromAbove), "Starting outside, then passing downward through existing building");
        ok(!world.addBuilding.canExecute(overlapFromSide), "Starting outside, then passing sideways through existing building");
        ok(!world.addBuilding.canExecute(startFromWithin), "Starting within another building");
        ok(!world.addBuilding.canExecute(overlapEntirelyFromAbove), "Starting outside, then passing downward through existing building and out other side");
        ok(!world.addBuilding.canExecute(overlapEntirelyFromSide), "Starting outside, then passing sideways through existing building and out other side");
        ok(!world.addBuilding.canExecute(sameSizeAndPosition), "Same size and position");
    });

     test("addBuilding can execute when specified building does not overlap an existing one", function () {
        var model = createModel({
                money: 1000,
                buildings: [
                    {
                        position: { x: 2, y: 2 },
                        size: { x: 3, y: 3 }
                    }
                ]
            }),
            world      = new GameWorld(model),
            toTheLeft  = createBuilding({ position: { x: 1, y: 3 }, size: { x: 1, y: 1 } }),
            toTheRight = createBuilding({ position: { x: 5, y: 3 }, size: { x: 1, y: 1 } }),
            onTop      = createBuilding({ position: { x: 3, y: 1 }, size: { x: 1, y: 1 } }),
            underneath = createBuilding({ position: { x: 3, y: 5 }, size: { x: 1, y: 1 } });

        ok(world.addBuilding.canExecute(toTheLeft), "To the left");
        ok(world.addBuilding.canExecute(toTheRight), "To the right");
        ok(world.addBuilding.canExecute(onTop), "On top");
        ok(world.addBuilding.canExecute(underneath), "Underneath");
    });

    test("addBuilding can execute for a valid building", function () {
        var model = createModel({ money: 10, size: { x: 10, y: 10 } }),
            world = new GameWorld(model),
            building = {
                cost: 10,
                position: { x: 0, y: 0 },
                size: { x: 10, y: 10 }
            };

        ok(world.addBuilding.canExecute(building), "Should be able to insert a valid building");
    });

    test("addBuilding adds the specified building to the model and charges the cost", function() {
        var model = createModel({ money: 100 }),
        world = new GameWorld(model),
        building = createBuilding({ cost: 50 });

        world.addBuilding(building);

        equal(model.buildings.indexOf(building), 0, "Building should have been added");
        equal(model.money, 50, "Building cost should have been charged");
    });
});