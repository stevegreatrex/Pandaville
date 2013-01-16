define(function () {
    var create = function (action, canExecute) {
        if (typeof action !== "function") { throw "Invalid action parameter"; }
        if (canExecute && typeof canExecute !== "function") { throw "Invalid canExecute parameter"; }

        canExecute = canExecute || function () { return true; };

        var innerAction = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            if (!canExecute.apply(this, args)) { throw "canExecute is false"; }

            return action.apply(this, args);
        };

        innerAction.canExecute = canExecute;

        return innerAction;
    };

    return {
        create: create
    };
});

//@ sourceURL=GameWorldAction.js