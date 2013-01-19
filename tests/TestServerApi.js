require(["MockFactory", "sinon"], function(MockFactory, sinon) {
    //
    // Mock setup
    //
    var
    jQuery = sinon.mock({
        get: function () { },
        post: function () { }
    }),
    context = MockFactory.createContext({
        "jquery": jQuery.object
    });

    //
    // Helpers
    // 

    //
    // Module
    //
    context(["ServerApi"], function (ServerApi) {
        module("ServerApi");

        test("constructor sets id and url", function() {
            var api = new ServerApi("id");
            
            equal(api.id, "id");
            equal(api.url, "/world/id/");
        });

        test("getModel gets url", function() {
            var api = new ServerApi("id"),
                jqueryPromise = {};

            jQuery.expects("get")
                .withArgs(api.url)
                .returns(jqueryPromise);

            var promise = api.getModel();

            equal(promise, jqueryPromise, "Should return promise from jquery");
        });

        test("addBuilding posts to server", function() {
            var api = new ServerApi("id"),
                building = {},
                jqueryPromise = {};

            jQuery.expects("post")
                .withArgs(api.url + "addBuilding", building)
                .returns(jqueryPromise);

            var promise = api.addBuilding(building);

            equal(promise, jqueryPromise, "Should return promise from jquery");
        });
    });
});