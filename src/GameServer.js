define(["underscore", "jquery", "GameWorld", "dataSource", "Errors"], function (_, $, GameWorld, dataSource, Errors) {
    var GameServer = function () {

    };

    GameServer.prototype.addBuilding = function (id, building) {
        var deferred = $.Deferred(),
        //handle successful retrieval of the model from the data source
        onModelRetrieved = function (model) {
            var world = new GameWorld(model);

            if (!world.addBuilding.canExecute(building)) {
                deferred.reject(Errors.invalidAction, model);
            } else {
                world.addBuilding(building);
                var updatedModel = world.getModel();
                dataSource.updateModel(id, updatedModel)
                    .done(_.bind(deferred.resolve, null, updatedModel))
                    .fail(function(error) {
                        deferred.reject(error, model);
                    });
            }
        };
        dataSource.getModel(id)
            .done(onModelRetrieved)
            .fail(function(error) {
                deferred.reject(error);
            });

        return deferred.promise();
    };

    return GameServer;
});