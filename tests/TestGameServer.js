require(["MockFactory", "sinon"], function(MockFactory, sinon) {
    //
    // Mock setup
    //
    var gameWorld = sinon.mock({
        addBuilding: function () { },
        getModel: function () { }
    }),
    context = MockFactory.createContext({
        "GameWorld": function () { return gameWorld; }
    });

    //
    // Module
    //
    context(["GameServer"], function (GameServer) {
        module("GameServer");

        test("constructor is not null", function() {
            ok(GameServer)
        });
    });
});