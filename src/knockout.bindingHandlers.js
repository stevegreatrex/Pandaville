define(["jquery", "knockout"], function ($, ko) {
    ko.bindingHandlers.worldSize = {
        update: function (element, valueAccessor) {
            var $element = $(element),
                value = ko.utils.unwrapObservable(valueAccessor());

            var scaleX = $element.width() / ko.utils.unwrapObservable(value.x),
                scaleY = $element.height() / ko.utils.unwrapObservable(value.y);

            $element.data("scale", Math.max(scaleX, scaleY));
        }
    };
	ko.bindingHandlers.scaleToWorld = {
		update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			var $svg =  $(element).parents("svg");

			ko.bindingHandlers.attr.update.call(this, element, function () {
			    return {
                    transform: "scale(" + $svg.data("scale") + ")"
			    }
			}, allBindingsAccessor, viewModel);
		}
	};
});