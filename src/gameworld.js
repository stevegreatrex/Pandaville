define(["GameWorldAction"], function (GameWorldAction) {
    var createDefaultModel = function () {
        return {
            money: 1000,
            xp: 0,
            size: { x: 10, y: 10 },
            buildings: []
        };
    },
    isInBounds = function (model, building) {
        var bottomRight = {
            x: building.position.x + building.size.x,
            y: building.position.y + building.size.y
        };

        return !(building.position.x < 0 || building.position.x >= model.size.x ||
                bottomRight.x > model.size.x ||
                building.position.y < 0 || building.position.y >= model.size.y ||
                bottomRight.y > model.size.y);
    };

    var GameWorld = function (initialModel) {
        var self = this,
            model = initialModel || createDefaultModel();

        self.getModel = function () {
            return model;
        };

        self.addBuilding = GameWorldAction.create(
            function (building) {
                model.buildings.push(building);
                model.money -= building.cost;
            },
            function(building) {
                return (building &&
                    building.cost <= model.money &&
                    isInBounds(model, building));
            });
    };

    return GameWorld;
});