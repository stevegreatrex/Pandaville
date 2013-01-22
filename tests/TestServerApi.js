require(["ServerApi", "sinon"], function (ServerApi, sinon) {
    module("ServerApi");

    test("constructor sets id and url", function() {
        var api = new ServerApi("id");
            
        equal(api.id, "id");
        equal(api.url, "/world/id/");
    });

    test("getModel gets url", function() {
        var api = new ServerApi("id"),
            jqueryPromise = {};

       $.get = sinon.stub()
            .withArgs(api.url)
            .returns(jqueryPromise);

        var promise = api.getModel();

        equal(promise, jqueryPromise, "Should return promise from jquery");
    });

    test("addBuilding posts to server", function() {
        var api = new ServerApi("id"),
            building = {},
            jqueryPromise = $.Deferred();

        $.ajax = sinon.stub()
            .withArgs({
                 url: api.url + "addBuilding",
                 data: JSON.stringify(building),
                 type: "post",
                contentType: "application/json"
            }).returns(jqueryPromise);
        
        var promise = api.addBuilding(building);

        equal(promise.state(), "pending", "should be pending");

        jqueryPromise.resolve();

        equal(promise.state(), "resolved", "should have been resolved");
    });

    test("addBuilding interprets server error message", function () {
        var api = new ServerApi("id"),
            error = { key: "error" },
            model = { key: "model" },
            building = {},
            jqueryPromise = $.Deferred();

        $.ajax = sinon.stub()
            .withArgs({
                 url: api.url + "addBuilding",
                 data: JSON.stringify(building),
                 type: "post",
                contentType: "application/json"
            }).returns(jqueryPromise);
        
        var errorFromServer,
            modelFromServer,
            promise = api.addBuilding(building);

        promise.fail(function(error, model) {
            errorFromServer = error;
            modelFromServer = model;
        });
        
        jqueryPromise.reject({
            responseText: JSON.stringify({
                error: error,
                model: model
            })
        });

        deepEqual(error, errorFromServer, "Error should have been returned");
        deepEqual(model, modelFromServer, "Model should have been returned");
    });
});