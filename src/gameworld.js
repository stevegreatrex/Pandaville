define(function () {
    var GameWorld = function () {
        var self = this,
            model = {
            money: 0,
            xp: 0,
            buildings: []
        };

        self.getModel = function () {
            return model;
        }
    };

    return GameWorld;
});