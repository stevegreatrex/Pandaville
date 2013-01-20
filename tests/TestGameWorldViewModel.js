require(["MockFactory", "sinon"], function(MockFactory, sinon) {
    //
    // Mock setup
    //
    var
    api = sinon.mock({
        getModel: function () { },
        addBuilding: function () { }
    }),
    gameWorld = sinon.mock({
        addBuilding: function () { },
        getModel: function () { }
    }),
    dataSource = sinon.mock({
        getModel: function (id) { },
        updateModel: function(id, model) { }
    }),
    context = MockFactory.createContext({
        "GameWorld": function (model) {
            gameWorld.constructorModel = model;
            return gameWorld.object;
        }
    });

    //
    // Helpers
    // 
    var createInitialModel = function () {
        return {
            size: { x: 1, y: 1 },
            position: { x: 1, y: 1 },
            buildings: []
        };
    };

    //
    // Module
    //
    context(["GameWorldViewModel"], function (GameWorldViewModel) {
        module("GameWorldViewModel");

        test("constructor sets name and world", function () {
            var initialModel = createInitialModel(),
                viewModel = new GameWorldViewModel("id", api.object, initialModel);

            equal(viewModel.name(), "id");
            ok(viewModel.size, "size should have been set");
            ok(viewModel.position, "position should have been set");
            ok(viewModel.buildings, "buildings should have been set");

            //check that the GameWorld was constructed
            equal(gameWorld.constructorModel, initialModel, "GameWorld should have been constructed with the model from the server");
        });

        test("grid returns buildings matrix", function() {
            var initialModel = createInitialModel(),
                viewModel = new GameWorldViewModel("id", api.object, initialModel);

            //setup buildings
            viewModel.buildings.push({
                position: { x: 2, y: 0 }
            });
            viewModel.buildings.push({
                position: { x: 1, y: 1 }
            });

            //setup size
            viewModel.size.x(3);
            viewModel.size.y(3);

            var grid = viewModel.grid();

            deepEqual(grid, [
                [null, null, buildings()[0]],
                [null, buildings()[1], null,
                [null, null, null]
            ]);
        });
    });
});