define(["jquery-deferred", "config", "request", "Error"], function ($, config, request, Error) {
    var handleError = function (response, error, deferred) {
        if (response.statusCode === 404) {
            deferred.reject(Error.modelNotFound());
            return true;
        }

        if (response.statusCode === 409) {
            deferred.reject(Error.updateConflict());
            return true;
        }
        
        if (error) {
            deferred.reject(Error.create(error));
            return true;
        }
    };

    return {
        getModel: function (id) {
            if (!id) { throw "Invalid id specified"; }

            var deferred = $.Deferred(),
                modelUrl = config.couchDb.url + "/" + id;

            request.get(modelUrl, function (error, response, body) {
                if (handleError(response, error, deferred)) { return; }
                
                deferred.resolve(JSON.parse(body));
            });

            return deferred.promise();
        },
        updateModel: function (id, model) {
            if (!id) { throw "Invalid id specified"; }
            if (!model) { throw "Invalid model specified"; }

            var deferred = $.Deferred(),
                modelUrl = config.couchDb.url + "/" + id;
            
            request.put(modelUrl, {
                json: model
            },
            function (error, response, body) {
                if (handleError(response, error, deferred)) { return; }
                deferred.resolve(body.rev);
            });

            return deferred.promise();
        }
    };
});