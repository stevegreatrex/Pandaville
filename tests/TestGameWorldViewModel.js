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
    context(["GameWorldViewModel", "knockout.mapping"], function (GameWorldViewModel, mapping) {
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

            //setup size
            viewModel.size.x(5);
            viewModel.size.y(5);
            
            //setup buildings
            var bdg1 = mapping.fromJS({
                position: { x: 3, y: 0 },
                size: { x: 1, y: 3 }
            }), bdg2 = mapping.fromJS({
                position: { x: 0, y: 2 },
                size: { x: 2, y: 2 }
            });
            viewModel.buildings.push(bdg1);
            viewModel.buildings.push(bdg2);

            

            var grid = viewModel.grid();

            deepEqual(grid, [
                [null, null, null, bdg1, null],
                [null, null, null, /*1*/ null],
                [bdg2, /*2*/ null, /*1*/ null],
                [/*2*/ /*2*/ null, null, null],
                [null, null, null, null, null],
            ]);
        });
    });
});