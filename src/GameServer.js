define(["underscore", "jquery", "GameWorld", "dataSource", "Errors"], function (_, $, GameWorld, dataSource, Errors) {
    var GameServer = function () {

    },
    wrapWorldAction = function (action) {
        return function () {
            var deferred   = $.Deferred(),
                id         = arguments[0],
                actionArgs = Array.prototype.slice.call(arguments, 1),

            //handle successful retrieval of the model from the data source
            onModelRetrieved = function (model) {
                var world = new GameWorld(model);

                if (!world[action].canExecute.apply(this, actionArgs)) {
                    deferred.reject(Errors.invalidAction, model);
                } else {
                    world[action].apply(this, actionArgs);
                    var updatedModel = world.getModel();
                    dataSource.updateModel(id, updatedModel)
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
    };

    GameServer.prototype.addBuilding = wrapWorldAction("addBuilding");

    return GameServer;
});