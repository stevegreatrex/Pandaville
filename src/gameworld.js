define(function () {
    var createDefaultModel = function () {
        return {
            money: 1000,
            xp: 0,
            size: { x: 10, y: 10 },
            buildings: []
        };
    };

    var GameWorld = function (initialModel) {
        var self = this,
            model = initialModel || createDefaultModel();

        self.getModel = function () {
            return model;
        };
    };

    return GameWorld;
});