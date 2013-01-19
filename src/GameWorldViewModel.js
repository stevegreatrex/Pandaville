define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api, initialModel) {
        var self = mapping.fromJS(initialModel),
            gameWorld   = new GameWorld(initialModel);

        self.name = ko.observable(id);

        return self;
    };

    return ViewModel;
});