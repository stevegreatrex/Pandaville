define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api, initialModel) {
        var self      = mapping.fromJS(initialModel),
            gameWorld = new GameWorld(initialModel),
            createEmptyArray = function (size, insertArray) {
                var result = [];
                for (var i = 0; i < size; i++) {
                    result.push(insertArray ? createEmptyArray(self.size.x()) : null);
                }
                return result;
            };

        self.name = ko.observable(id);
        self.grid = ko.computed(function () {
            var buildings = self.buildings(),
                rows = createEmptyArray(self.size.y(), true);
            for (var i = 0; i < buildings.length; i++) {
                var building = buildings[i],
                    buildingPos = building.position;
               
                rows[buildingPos.y()][buildingPos.x()] = building;
            }

            return rows;
        }, this);

        return self;
    };

    return ViewModel;
});