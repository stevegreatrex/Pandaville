define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api, initialModel) {
        var self      = mapping.fromJS(initialModel),
            gameWorld = new GameWorld(initialModel),
            gridDependency = ko.observable(),
            refreshGrid = function () {
              gridDependency.valueHasMutated();  
            },
            createEmptyArray = function (size, insertArray) {
                var result = [];
                for (var i = 0; i < size; i++) {
                    result.push(insertArray ? createEmptyArray(self.size.x()) : null);
                }
                return result;
            },
            clearBuildingSpace = function (grid, building) {
                for (var y = 0; y < building.size.y(); y++) {
                    for (var x = 0; x < building.size.x() ; x++) {
                        if (x + y > 0) { //skip [0,0]
                            grid[building.position.y() + y].splice([building.position.x() + x], 1);
                        }
                    }
                }
            },
            refreshModelOnError = function (err, model) {
                alert(err.message || err);
                gameWorld.setModel(model);
                updateObservableProperties();
            },
            updateObservableProperties = function () {
                mapping.fromJS(gameWorld.getModel(), self);
                refreshGrid();
            };

        self.name = ko.observable(id);
        self.grid = ko.computed(function () {
            var buildings = self.buildings(),
                fakeDependency = gridDependency(),
                rows = createEmptyArray(self.size.y(), true);

            for (var i = 0; i < buildings.length; i++) {
                var building = buildings[i],
                    buildingPos = building.position;

                rows[buildingPos.y()][buildingPos.x()] = building;
                clearBuildingSpace(rows, building);
            }

            return rows;
        }, this);

        self.addBuilding = ko.command(function (building) {

            building = { name: 'Four', cost: 700, size: { x: 1, y: 1 }, position: { x: 4, y: 6 } };
            gameWorld.addBuilding(building);
            updateObservableProperties();

            return api.addBuilding(building);
        }).done(gameWorld.setModel).fail(refreshModelOnError);

        return self;
    };

    return ViewModel;
});