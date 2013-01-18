require(["MockFactory", "sinon", "jquery"], function(MockFactory, sinon, $) {
    //
    // Mock setup
    //
    var
    request = sinon.mock({
        get: function () { },
        post: function () { },
        auth: function () { }
    }),
    config = {
        couchDb: {
            url: "http://user:pws@server:1234/database",
        }
    },
    context = MockFactory.createContext({
        "request": request.object,
        "config": config
    });

    //
    // Helpers
    //
    var setupUpdateCall = function (id, model) {
        var updateCall = request.expects("post")
            .withArgs(config.couchDb.url + "/" + id, {
                multipart: [ {
                    "content-type": "application/json",
                    body: JSON.stringify(model)
                    }
                ]
            });

        return updateCall;
    };

    //
    // Module
    //
    context(["dataSource", "errors",], function (dataSource, errors) {
        module("dataSource");

        test("getModel throws on null id", function () {
            raises(function() {
                dataSource.getModel();
            },/id/);
        });

        test("getModel rejects promise with error from request", function () {
            var id = "id";

            //setup the request call to return an error
            var getCall  = request.expects("get")
                .withArgs(config.couchDb.url + "/" + id);

            //invoke with a fail handler
            var serverError;
            dataSource.getModel(id)
                .fail(function(error) {
                    serverError = error;
                });

            getCall.yield("error!", {});

            //check that the fail handler was invoked
            equal(serverError, "error!", "Should have passed back the error from the server");
        });

        test("getModel rejects with 'not found' error for 404s", function () {
            var id = "id";

            //setup the request call to return an error
            var getCall  = request.expects("get")
                .withArgs(config.couchDb.url + "/" + id);

            //invoke with a fail handler
            var serverError;
            dataSource.getModel(id)
                .fail(function(error) {
                    serverError = error;
                });

            getCall.yield("error!", { statusCode: 404 });

            //check that the fail handler was invoked
            equal(serverError, errors.modelNotFound, "Should interpret 404 as 'model not found'");
        });

        test("getModel returns the parsed model from couchdb", function () {
            var id = "id",
                model = {
                    property: {
                        value: "1",
                        otherValue: 2
                    },
                    something: [1, 2, 3]
                };

            //setup the request call to return an error
            var getCall  = request.expects("get")
                .withArgs(config.couchDb.url + "/" + id);

            //invoke with a fail handler
            var returnedModel;
            dataSource.getModel(id)
                .done(function(model) {
                    returnedModel = model;
                });

            getCall.yield(null, { statusCode: 200 }, JSON.stringify(model));

            //check that the expected model was returned
            deepEqual(returnedModel, model, "Model was not returned");
        });

        test("updateModel throws on null id or model", function () {
            raises(function() {
                dataSource.updateModel(null, {});
            }, /id/);

            raises(function() {
                dataSource.updateModel("id", null);
            },/model/);
        });

        test("updateModel rejects promise with error from request", function () {
            var id = "id";

            //setup the request call
            var updateCall = setupUpdateCall(id, {});

            //invoke with a fail handler
            var serverError;
            dataSource.updateModel(id, {})
                .fail(function(error) {
                    serverError = error;
                });

            updateCall.yield("error!", {});

            //check that the fail handler was invoked
            equal(serverError, "error!", "Should have passed back the error from the server");
        });

        test("updateModel rejects with 'not found' error for 404s", function () {
            var id = "id";

            //setup the request call
            var updateCall = setupUpdateCall(id, {});

            //invoke with a fail handler
            var serverError;
            dataSource.updateModel(id, {})
                .fail(function(error) {
                    serverError = error;
                });

            updateCall.yield("error!", { statusCode: 404 });

            //check that the fail handler was invoked
            equal(serverError, errors.modelNotFound, "Should interpret 404 as 'model not found'");
        });

        test("updateModel rejects with 'conflict' error for 409s", function () {
            var id = "id";

            //setup the request call
            var updateCall = setupUpdateCall(id, {});

            //invoke with a fail handler
            var serverError;
            dataSource.updateModel(id, {})
                .fail(function(error) {
                    serverError = error;
                });

            updateCall.yield("error!", { statusCode: 409 });

            //check that the fail handler was invoked
            equal(serverError, errors.updateConflict, "Should interpret 409 as 'conflict'");
        });

        test("updateModel resolves when request succeeds", function () {
            var id = "id",
                model = {
                    property: {
                        value: "1",
                        otherValue: 2
                    },
                    something: [1, 2, 3]
                };

            //setup the request call
            var updateCall = setupUpdateCall(id, model);

            //invoke with a fail handler
            var serverRev;
            dataSource.updateModel(id, model)
                .done(function(rev) {
                    serverRev = rev;
                });

            updateCall.yield(null, { statusCode: 201 }, '{ "rev": "new rev" }');

            //check that the done handler was invoked
            equal(serverRev, "new rev", "Should have returned new revision");
        });
    });
});