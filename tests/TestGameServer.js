require(["MockFactory", "sinon", "jquery", "errors"], function(MockFactory, sinon, $, Errors) {
    //
    // Mock setup
    //
    var
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
        "dataSource": dataSource.object
    });

    //
    // Helpers
    // 
    var setupGetModelCall = function (id) {
        var dataSourcePromise = $.Deferred();
        dataSource
            .expects("getModel")
            .withExactArgs(id)
            .once()
            .returns(dataSourcePromise);

        return dataSourcePromise;
    },
    setupUpdateModelCall = function (model) {
        var dataSourcePromise = $.Deferred();
        dataSource
            .expects("updateModel")
            .withExactArgs(model)
            .once()
            .returns(dataSourcePromise);

        return dataSourcePromise;
    },
    setupActionCallWithCanExecute = function(action) {
        gameWorld.object[action].canExecute = sinon.stub().withArgs(arguments[1]).returns(true);
        gameWorld.expects(action).withArgs(arguments[1]).once();
        var updatedModel = { key: "updated" };
        gameWorld.expects("getModel").returns(updatedModel);

        return updatedModel;
    };

    //
    // Module
    //
    context(["GameServer"], function (GameServer) {
        module("GameServer");

        test("constructor is not null", function() {
            ok(GameServer);
            var server = new GameServer();
            ok(server);
        });

        test("worldAction fails on non-existant model ID", function() {
            var server = new GameServer(),
                id     = "id";
               
            //setup the datasource to return the promise
            var dataSourcePromise = setupGetModelCall(id);

            //call the server and record the response
            var serverPromise = server.worldAction(id, "addBuilding", {});
            
            //check that the promise has not yet been resolved
            equal(serverPromise.state(), "pending", "Should not be resolved yet");

            //hook up a fail handler on the server promise
            var serverError;
            serverPromise.fail(function(error) {
                serverError = error;
            });

            //now fail the datasource
            dataSourcePromise.reject(Errors.modelNotFound);

            //and check that the server promise was rejected
            equal(serverPromise.state(), "rejected", "Should have been resolved");
            equal(serverError, Errors.modelNotFound);
        });

        test("worldAction fails if canExecute returns false", function () {
            var server = new GameServer(),
                id     = "id",
                building = {},
                model = {};
               
            //setup the datasource to return the promise
            var dataSourcePromise = setupGetModelCall(id);

            //call the server and record the response
            var serverPromise = server.worldAction(id, "addBuilding", building);
            
            //check that the promise has not yet been resolved
            equal(serverPromise.state(), "pending", "Should not be resolved yet");

            //make canExecute return false
            gameWorld.object.addBuilding.canExecute = sinon.stub().withArgs(building).returns(false);
            
            //record the error and returned model from the server
            var serverError, returnedModel;
            serverPromise.fail(function (error, model) {
                serverError   = error;
                returnedModel = model;
            });

            //now let the datasource succeed
            dataSourcePromise.resolve(model);

            //and check that the server promise was rejected with the original model
            equal(serverPromise.state(), "rejected", "Should have been rejected");
            equal(serverError, Errors.invalidAction, "Returned error was incorrect");
            equal(returnedModel, model, "Should have returned the original model");

            //check that the constructed GameWorld had the model passed in
            equal(gameWorld.constructorModel, model, "Unexpected constructor model");

            //no need to check that gameWorld wasn't called - mock handles this
        });

        test("worldAction updates model, then saves and returns the updated model", function () {
             var server = new GameServer(),
                id     = "id",
                building = { key: "building" },
                model = { key: "original" };
               
            //setup the datasource to return the promise
            var dataSourcePromise = setupGetModelCall(id);

            //call the server and record the response
            var serverPromise = server.worldAction(id, "addBuilding", building);
            
            //check that the promise has not yet been resolved
            equal(serverPromise.state(), "pending", "Should not be resolved yet");

            //expect model update and getModel calls
            var updatedModel = setupActionCallWithCanExecute("addBuilding", building);
            
            //after model updated, expect the data source to be updated
            var dataSourceUpdatePromise = setupUpdateModelCall(updatedModel);

            //now let the datasource getModel call succeed
            dataSourcePromise.resolve(model);

            //check that the server promise is STILL not resolved (waiting on the datasource update)
            equal(serverPromise.state(), "pending", "Should not be resolved yet");

            //hook up a success handler
            var returnedModel;
            serverPromise.done(function (model) {
                returnedModel = model;
            });

            //finally, let the datasource updateModel succeed
            dataSourceUpdatePromise.resolve();

            //and check that the server promise was resolved with the updated model
            equal(serverPromise.state(), "resolved", "Should have been resolved");
            equal(returnedModel, updatedModel, "Should have returned the updated model");

            //check that the constructed GameWorld had the model passed in
            equal(gameWorld.constructorModel, model, "Unexpected constructor model");
        });

        test("worldAction returns error raised when updating model", function () {
             var server  = new GameServer(),
                id       = "id",
                building = { key: "building" },
                model    = { key: "original" };
               
            //setup the datasource getModel and call the server
            var dataSourcePromise = setupGetModelCall(id);
            var serverPromise = server.worldAction(id, "addBuilding", building);

            //expect model update and getModel calls
            var updatedModel = setupActionCallWithCanExecute("addBuilding", building);
            
            //after model updated, expect the data source to be updated
            var dataSourceUpdatePromise = setupUpdateModelCall(updatedModel);

            //now let the datasource getModel call succeed
            dataSourcePromise.resolve(model);

            //hook up an error handler
            var serverError, returnedModel;
            serverPromise.fail(function (error, model) {
                serverError   = error;
                returnedModel = model;
            });

            //finally, fail the updateModel call
            dataSourceUpdatePromise.reject("random error");

            //and check that the server promise was rejected
            equal(serverPromise.state(), "rejected", "Should have been rejected");
            equal(serverError, "random error", "Returned error was incorrect");
            equal(returnedModel, model, "Should have returned the original model");
        });
    });
});