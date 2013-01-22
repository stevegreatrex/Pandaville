define(["jquery"], function($) {
    var ServerApi = function (id) {
        this.id = id;
        this.url = "/world/" + id + "/";
    };

    ServerApi.prototype.getModel = function () {
        return $.get(this.url);
    };

    ServerApi.prototype.addBuilding = function (building) {
        var deferred = $.Deferred();
        $.ajax({
            url: this.url + "addBuilding",
            contentType: "application/json",
            data: JSON.stringify(building),
            type: "post"
        })
        .done(deferred.resolve)
        .fail(function (error, b, c, d) {
            var detail = JSON.parse(error.responseText);
            deferred.reject(detail.error, detail.model);
        });

        return deferred.promise();
    };

    return ServerApi;
});