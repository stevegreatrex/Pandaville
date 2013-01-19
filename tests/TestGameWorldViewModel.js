require(["MockFactory", "sinon"], function(MockFactory, sinon) {
    //
    // Mock setup
    //
    var
    api = sinon.mock({
        getModel: function () { },
        addBuilding: function () { }
    }),
    mapping = sinon.mock({
        fromJS: function () { }
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
        },
        "knockout.mapping": mapping.object
    });

    //
    // Helpers
    // 
    var setupGetModelCall = function (model) {
        api.expects("getModel")
            .returns({
            done: function (handler) {
                //immediately invoke the callback
                handler(model);
            }
        });
    },
    setupMappingCall = function (from, to) {
        mapping.expects("fromJS")
            .withArgs(from)
            .returns(to);
    };

    //
    // Module
    //
    context(["GameWorldViewModel"], function (GameWorldViewModel) {
        module("GameWorldViewModel");

        test("constructor sets name and world", function () {
            var modelFromServer = {},
                mappedModel = {};

            setupGetModelCall(modelFromServer);
            setupMappingCall(modelFromServer, mappedModel);

            var viewModel = new GameWorldViewModel("id", api.object);

            equal(viewModel.name(), "id");
            equal(viewModel.world(), mappedModel, "world model should have been set");

            //check that the GameWorld was constructed
            equal(gameWorld.constructorModel, modelFromServer, "GameWorld should have been constructed with the model from the server");
        });
    });
});