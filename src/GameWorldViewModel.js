define(["jquery", "knockout", "knockout.mapping", "GameWorld", "command"], function ($, ko, mapping, GameWorld) {
    var ViewModel = function (id, api) {
        var self = this,
            gameWorld,
            updateWorld = function (model) {
                self.world(mapping.fromJS(model));
            };

        this.name = ko.observable(id);
        this.world = ko.observable();
        this.init = ko.command(function() {
            return api.getModel().done(function (model) {
                gameWorld = new GameWorld(model);
                updateWorld(model);
            });
        });
        
        self.init();
    };

    return ViewModel;
});