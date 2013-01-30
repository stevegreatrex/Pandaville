define(["jquery", "knockout"], function ($, ko) {
    ko.bindingHandlers.worldSize = {
        update: function (element, valueAccessor) {
            var $element = $(element),
                value = ko.utils.unwrapObservable(valueAccessor());

            var scaleX = $element.width() / ko.utils.unwrapObservable(value.x),
                scaleY = $element.height() / ko.utils.unwrapObservable(value.y);

            $element.data("scale", Math.min(scaleX, scaleY));
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

    ko.bindingHandlers.draggable = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                $svg = $element.parents("svg");
            
            $element.on("mousedown.drag", function (e) {
                var startElementPosition = $element.position(),
                    offsetInClient = {
                        x: e.clientX - startElementPosition.left,
                        y: e.clientY - startElementPosition.top
                    };

                $element.data("dragging", true);
                    
                $svg.on("mousemove.drag", function (e) {
                    if (!$element.data("dragging")) { return; }
                    
                    var scale = $svg.data("scale"),
                        x = (e.clientX - offsetInClient.x) / scale,
                        y = (e.clientY - offsetInClient.y) / scale;

                    viewModel.position.x(Math.round(x));
                    viewModel.position.y(Math.round(y));
                });

                $element.on("mouseup.drag", function () {
                    $element.off("mouseup.drag mouseout.drag");
                    $element.data("dragging", false);
                });
            });
          
        }
    }
});