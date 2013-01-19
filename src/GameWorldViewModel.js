define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api, initialModel) {
        var self = mapping.fromJS(initialModel),
            gameWorld   = new GameWorld(initialModel),
            updateWorld = function (newModel) {
                mapping.fromJS(newModel, self);
            };

        self.name = ko.observable(id);

        updateWorld(initialModel);
        return self;
    };

    return ViewModel;
});