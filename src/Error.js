define(function () {

    var ErrorTypes = {
        generic: "Generic Error",
        modelNotFound: "Model not found",
        invalidAction: "Invalid Action",
        updateConflict: "Conflict during model update"
    },
    Error = function (message, type) {
        this.message = message,
        this.type = type;
    },
    createFactoryMethod = function(type) {
        return function(message) {
            return new Error(message, type);
        };
    },
    createTestMethod = function(type) {
        return function(error) {
            return error && error.type === type;
        };
    };

    return {
        create: createFactoryMethod(ErrorTypes.generic),

        modelNotFound: createFactoryMethod(ErrorTypes.modelNotFound),
        isModelNotFound: createTestMethod(ErrorTypes.modelNotFound),

        invalidAction: createFactoryMethod(ErrorTypes.invalidAction),
        isInvalidAction: createTestMethod(ErrorTypes.invalidAction),

        updateConflict: createFactoryMethod(ErrorTypes.updateConflict),
        isUpdateConflict: createTestMethod(ErrorTypes.updateConflict)
    };

    return {
        
    };
});