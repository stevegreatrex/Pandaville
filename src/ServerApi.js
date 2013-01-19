define(["jquery"], function($) {
    var ServerApi = function (id) {
        this.id = id;
        this.url = "/world/" + id + "/";
    };

    ServerApi.prototype.getModel = function () {
        return $.get(this.url);
    };

    ServerApi.prototype.addBuilding = function (building) {
        return $.post(this.url + "addBuilding", building);
    };

    return ServerApi;
});