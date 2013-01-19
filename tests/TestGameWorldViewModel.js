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
    var setupMappingCall = function (from, to) {
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
            var initialModel = "initial", //using string to work around sinon matching; should be object
                mappedModel = {};

            setupMappingCall(initialModel, mappedModel);

            var viewModel = new GameWorldViewModel("id", api.object, initialModel);

            equal(viewModel.name(), "id");
            equal(viewModel, mappedModel, "world model should have been set");

            //check that the GameWorld was constructed
            equal(gameWorld.constructorModel, initialModel, "GameWorld should have been constructed with the model from the server");
        });
    });
});