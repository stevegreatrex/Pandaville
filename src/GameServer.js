define(["underscore", "jquery-deferred", "GameWorld", "dataSource", "errors"], function (_, $, GameWorld, dataSource, Errors) {
    var GameServer = function () {

    };

    GameServer.prototype.worldAction = function (id, action) {
        var deferred   = $.Deferred(),
            actionArgs = Array.prototype.slice.call(arguments, 2),

        //handle successful retrieval of the model from the data source
        onModelRetrieved = function (model) {
            var world = new GameWorld(model);

            if (!world[action].canExecute.apply(this, actionArgs)) {
                deferred.reject(Errors.invalidAction, model);
            } else {
                world[action].apply(this, actionArgs);
                var updatedModel = world.getModel();
                dataSource.updateModel(updatedModel)
                    .done(_.bind(deferred.resolve, this, updatedModel))
                    .fail(function(error) {
                        deferred.reject(error, model);
                    });
            }
        };

        //get the model from the datasource
        dataSource.getModel(id)
            .done(onModelRetrieved)
            .fail(deferred.reject);

        return deferred.promise();
    };

    return GameServer;
});