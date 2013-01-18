define(["knockout", "knockout.mapping", "GameWorld"], function (ko, GameWorld) {
    var ViewModel = function (id) {
        this.name = ko.observable(id);
    };

    return ViewModel;
});