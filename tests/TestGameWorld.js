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
                name: "Building",
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

    test("setModel sets the model", function () {
        var model = createModel(),
            world = new GameWorld(model),
            newModel = { key: "new model" };

        world.setModel(newModel);

        equal(world.getModel(), newModel, "Should use udpated model");
    });

    test("setModel ignores null models", function () {
        var model = createModel(),
            world = new GameWorld(model);

        world.setModel();
        world.setModel(null);

        equal(world.getModel(), model, "Should use constructor-specified model");
    });

    test("addBuilding cannot execute with no building", function () {
        var world = new GameWorld();

        ok(!world.addBuilding.canExecute(), "Should not be able to execute with a null building");
        equal(world.addBuilding.canExecuteDetail().message, "Building was null");
    });

    test("addBuilding cannot execute when specified building costs more than balance", function() {
        var model = createModel({ money: 100 }),
            world = new GameWorld(model),
            building = createBuilding({ cost: 101 });

        ok(!world.addBuilding.canExecute(building), "Building is too expensive");
        equal(world.addBuilding.canExecuteDetail(building).message, "Too expensive");
        
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

        equal(world.addBuilding.canExecuteDetail(outOfBoundsNegativeX).message, "Out of bounds");
        equal(world.addBuilding.canExecuteDetail(outOfBoundsNegativeY).message, "Out of bounds");
        equal(world.addBuilding.canExecuteDetail(outOfBoundsX).message, "Out of bounds");
        equal(world.addBuilding.canExecuteDetail(outOfBoundsY).message, "Out of bounds");
        equal(world.addBuilding.canExecuteDetail(tooBigX).message, "Out of bounds");
        equal(world.addBuilding.canExecuteDetail(tooBigY).message, "Out of bounds");
        
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
            sameSizeAndPosition      = createBuilding({ position: { x: 2, y: 2 }, size: { x: 3, y: 3 } }),
            nameless                 = createBuilding({ position: { x: 3, y: 3 }, size: { x: 1, y: 1 } });

        delete nameless.name;

        ok(!world.addBuilding.canExecute(fullyWithin), "Fully within another building");
        ok(!world.addBuilding.canExecute(overlapFromAbove), "Starting outside, then passing downward through existing building");
        ok(!world.addBuilding.canExecute(overlapFromSide), "Starting outside, then passing sideways through existing building");
        ok(!world.addBuilding.canExecute(startFromWithin), "Starting within another building");
        ok(!world.addBuilding.canExecute(overlapEntirelyFromAbove), "Starting outside, then passing downward through existing building and out other side");
        ok(!world.addBuilding.canExecute(overlapEntirelyFromSide), "Starting outside, then passing sideways through existing building and out other side");
        ok(!world.addBuilding.canExecute(sameSizeAndPosition), "Same size and position");

        equal(world.addBuilding.canExecuteDetail(fullyWithin).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(overlapFromAbove).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(overlapFromSide).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(overlapEntirelyFromAbove).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(overlapEntirelyFromSide).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(sameSizeAndPosition).message, "Overlaps Building");
        equal(world.addBuilding.canExecuteDetail(nameless).message, "Overlaps existing building");
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
        var model    = createModel({ money: 100 }),
            world    = new GameWorld(model),
            building = createBuilding({ cost: 50 });

        world.addBuilding(building);

        equal(model.buildings.indexOf(building), 0, "Building should have been added");
        equal(model.money, 50, "Building cost should have been charged");

        ok(building.id, "The building should be assigned a unique ID");
    });

    test("addBuilding assigns a unique ID to each building", function() {
        var model     = createModel({ money: 100 }),
            world     = new GameWorld(model),
            building1 = createBuilding({ cost: 50 }),
            building2 = createBuilding({ cost: 50, position: { x: 2, y: 2 } });

        world.addBuilding(building1);
        world.addBuilding(building2);

        equal(model.buildings.indexOf(building1), 0, "Building should have been added");
        equal(model.buildings.indexOf(building2), 1, "Building should have been added");
        equal(model.money, 0, "Building cost should have been charged");

        ok(building1.id, "The building should be assigned a unique ID");
        ok(building2.id, "The building should be assigned a unique ID");
        notEqual(building1.id, building2.id, "The assigned IDs should be UNIQUE");
    });
});