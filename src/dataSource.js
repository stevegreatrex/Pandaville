﻿define(["jquery-deferred", "config", "request", "errors"], function ($, config, request, errors) {
    var handleError = function (response, error, deferred) {
        if (response.statusCode === 404) {
            deferred.reject(errors.modelNotFound);
            return true;
        }

        if (response.statusCode === 409) {
            deferred.reject(errors.updateConflict);
            return true;
        }
        
        if (error) {
            deferred.reject(error);
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
        updateModel: function (model) {
            if (!model) { throw "Invalid model specified"; }

            var deferred = $.Deferred(),
                modelUrl = config.couchDb.url;
            
            request.post(modelUrl, {
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