require(["../src/GameWorldAction"], function (GameWorldAction) {
    module("GameWorldAction");

    var noop = function() {};
    
    test("GameWorldAction.create is non-null", function () {
        ok(GameWorldAction, "GameWorldAction was not defined");
        ok(GameWorldAction.create, "GameWorldAction.create was not defined");
    });

    test("GameWorldAction instance is an executable function", function() {
        var action = GameWorldAction.create(noop);
        equal(typeof action, "function");
    });

    test("throws when no function is specified to create", function () {
        raises(function() {
            GameWorldAction.create();
        });
    });

    test("throws when a non-function is passed to create", function () {
        raises(function() {
            GameWorldAction.create({});
        });
    });

    test("invoking created function invokes original function", function () {
        var innerFunctionArgs,
            innerFunction = function (a, b, c) {
                innerFunctionArgs = [a,b,c];
                return "inner function result";
            },
            action = GameWorldAction.create(innerFunction);

        var result = action(1, "2", { three: true });

        equal(result, "inner function result", "Inner function's result should have been passed back");

        deepEqual(innerFunctionArgs,
            [1, "2", { three: true }],
            "innerFunction should have been invoked with parameters from outer function");
    });

    test("has canExecute method when none is specified", function() {
        var action = GameWorldAction.create(noop);

        ok(action.canExecute, "Should have a canExecute function");
        ok(action.canExecute(), "Default canExecute should return true");
    });

    test("canExecute uses specified method", function () {
        var flag = false,
            canExecute = function () {
                return flag;
            },
            action = GameWorldAction.create(noop, canExecute);

        ok(!action.canExecute(), "canExecute should return flag value");

        flag = true;
        ok(action.canExecute(), "canExecute should return flag value");
    });

    test("canExecute supports objects being returned", function () {
        var flag = false,
            canExecute = function () {
                return {
                    canExecute: flag
                };
            },
            action = GameWorldAction.create(noop, canExecute);

        ok(!action.canExecute(), "canExecute should return flag value");

        flag = true;
        ok(action.canExecute(), "canExecute should return flag value");
    });

    test("canExecuteDetail returns the full result of the inner canExecute", function () {
        var fullDetail = {
                canExecute: true,
                message: "some message",
                id: "maybe it needs an ID"
            },
            canExecute = function () {
                return fullDetail;
            },
            action = GameWorldAction.create(noop, canExecute);

        deepEqual(action.canExecuteDetail(), fullDetail, "All the detail should have been returned");
    });

    test("throws exception when non-function canExecute implementation is passed", function () {
        raises(function() {
            GameWorldAction.create(noop, {});
        }, function (err) {
            return !!/canExecute/.exec(err.message);
        });
        raises(function() {
            GameWorldAction.create(noop, "non-function");
        }, function (err) {
            return !!/canExecute/.exec(err.message);
        });
    });

    test("throws exception when action is invoked and canExecute returns false", function () {
        var action = GameWorldAction.create(noop, function () { return false; });

        raises(action, function (err) {
            return !!/canExecute/.exec(err.message);
        });
    });

    test("throws exception with error message when one is returned from canExecute", function() {
        var action = GameWorldAction.create(noop, function () {
            return {
                canExecute: false,
                message: "Error!"
            };
        });

        raises(action, function (err) {
            return err.message === "Error!";
        });
    });

    test("canExecute is passed calling parameters when invoked through the action", function () {
        var canExecuteArgs,
            canExecute = function (a, b, c) {
                canExecuteArgs = [a,b,c];
                return "inner function result";
            },
            action = GameWorldAction.create(noop, canExecute);

        action(1, "2", { three: true });

        deepEqual(canExecuteArgs,
            [1, "2", { three: true }],
            "canExecute should have been invoked with parameters from outer function");
    });
});