define(["Error"], function (Error) {
    var create = function (action, canExecute) {
        if (typeof action !== "function") { throw Error.create("Invalid action parameter"); }
        if (canExecute && typeof canExecute !== "function") { throw Error.create("Invalid canExecute parameter"); }

        canExecute = canExecute || function () { return { canExecute: true }; };

        var unwrap = function (canExecuteResult) {
            if (typeof canExecuteResult === "object") {
                return canExecuteResult.canExecute;
            } else {
                return canExecuteResult;
            }
        },
        innerAction = function () {
            var args = Array.prototype.slice.call(arguments, 0),
                canExecuteResult = canExecute.apply(this, args);

            if (!unwrap(canExecuteResult)) {
                throw Error.create(canExecuteResult.message || "canExecute is false");
            }

            return action.apply(this, args);
        };

        innerAction.canExecuteDetail = canExecute;
        innerAction.canExecute = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            return unwrap(canExecute.apply(this, args));
        };

        return innerAction;
    };

    return {
        create: create
    };
});