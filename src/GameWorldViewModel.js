define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command", "knockout.bindingHandlers"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api, initialModel) {
        var self      = mapping.fromJS(initialModel),
            gameWorld = new GameWorld(initialModel),
            refreshModelOnError = function (err, model) {
                gameWorld.setModel(model);
                updateObservableProperties();
            },
            updateObservableProperties = function () {
                mapping.fromJS(gameWorld.getModel(), self);
            };

        self.name = ko.observable(id);
        self.grid = ko.observableArray();

        self.addBuilding = ko.command(function (building) {

            building = { name: '8', cost: 700, size: { x: 1, y: 1 }, position: { x: 4, y: 9 } };
            gameWorld.addBuilding(building);
            updateObservableProperties();

            return api.addBuilding(building);
        }).done(gameWorld.setModel).fail(refreshModelOnError);

        return self;
    };

    return ViewModel;
});