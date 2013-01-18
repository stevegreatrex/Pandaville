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
        var bottomRight = getBottomRight(building);

        return !(building.position.x < 0 || building.position.x >= model.size.x ||
            bottomRight.x > model.size.x ||
            building.position.y < 0 || building.position.y >= model.size.y ||
            bottomRight.y > model.size.y);
    },
    getBottomRight = function (building) {
        return {
            x: building.position.x + building.size.x,
            y: building.position.y + building.size.y
        };
    },
    buildMatrix = function (size) {
        var cols = [];
        for (var i = 0; i < size.x; i++) {
            var rows = [];
            for (var j = 0; j < size.y; j++) {
                rows.push(0);
            }
            cols.push(rows);
        }
        return cols;
    },
    renderMatrix = function (matrix) {
        var output = "";
        for (var x = 0; x < matrix.length; x++) {
            for (var y = 0; y < matrix[x].length; y++) {
                output += matrix[x][y];
            }
            output += "\r\n";
        }
        return output;
    },
    checkOverlaps = function (matrix, building) {
        var bottomRight = getBottomRight(building);
        for (var x = building.position.x; x < bottomRight.x; x++) {
            for (var y = building.position.y; y < bottomRight.y; y++) {
                matrix[x][y] += 1;
                if (matrix[x][y] > 1) {
                    return true;
                }
            }
        }
        return false;
    },
    overlapsAnyBuilding = function (model, building) {
        var existingBuildings = model.buildings,
            matrix            = buildMatrix(model.size);
        
        checkOverlaps(matrix, building); //can't return true as a building can't overlap itself
        
        for (var i = 0; i < existingBuildings.length; i++) {
            if (checkOverlaps(matrix, existingBuildings[i])) {
                return true;
            }
        }

        return false;
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
                    isInBounds(model, building) &&
                    !overlapsAnyBuilding(model, building));
            });
    };

    return GameWorld;
});