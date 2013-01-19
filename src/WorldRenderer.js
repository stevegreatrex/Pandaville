define(["jquery", "kinetic", "knockout"], function ($, Kinetic, ko) {
    var fadeIn = function (target, duration) {
            duration = duration || 700;
            var animation = new Kinetic.Animation(function(frame) {
            if (frame.time >= duration) {
                animation.stop() ;
            } else {
                target.setOpacity(frame.time / duration) ;
            }
            }, target.getLayer());

        animation.start();
    },
    redraw = function (node) {
        node.getParent() && node.getLayer().draw();
    },
    bind = function (node, bindings) {
        var attrs = {};
        for (var property in bindings) {
            if (bindings.hasOwnProperty(property)) {
                var value = bindings[property];

                if (ko.isObservable(value)) {
                    value.subscribe(function (newValue) {
                        var attrs = {};
                        attrs[property] = newValue;
                        node.setAttrs(attrs);
                        redraw(node);
                    });

                    value = ko.utils.unwrapObservable(value);
                } 
                
                attrs[property] = value;
            }
        }
        node.setAttrs(attrs);
        redraw(node);
    };

    var WorldRenderer = function (viewModel) {
        var $world = $("#world"),
            stage = new Kinetic.Stage({
                container: "world",
                width: $world.innerWidth(),
                height: $world.innerHeight()
            }),
            layer = new Kinetic.Layer({ opacity: 0.0 }),
            rect = new Kinetic.Rect({
                x: 239,
                y: 75,
                width: 100,
                height: 50,
                stroke: 'black',
                strokeWidth: 4
            }),
            money = new Kinetic.Text({
                x: 10, y: 400,
                fontSize: 30,
                fill: "green"
            });

        rect.on("click", function () {
            viewModel.money(viewModel.money()-10);
        });

        bind(money, {
            text: viewModel.money
        });

        layer.add(money);
        layer.add(rect);
        stage.add(layer);
        fadeIn(layer);
    };

    return WorldRenderer;
});