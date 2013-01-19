define(["jquery", "kinetic", "knockout"], function ($, Kinetic, ko) {
    
    //
    // Helpers
    // 
    var fadeIn = function (target, duration, then) {
            var animation = new Kinetic.Animation(function(frame) {
            if (frame.time >= duration) {
                target.setOpacity(1.0)
                animation.stop();
                if (then) {
                    then();
                }
            } else {
                target.setOpacity(frame.time / duration);
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

    //
    // Renderer
    //
    var WorldRenderer = function (viewModel) {
        var self = this;
        
        this.viewModel  = viewModel;
        this.stage      = this.createStage("world");
        this.background = this.createBackground();
        this.worldBoard = this.createWorldBoard();
        this.zoom       = 1.0;

        this.stage.add(this.background);
        this.stage.add(this.worldBoard);

        fadeIn(this.background, 1000, function () {
            fadeIn(self.worldBoard, 700);
        });
    };

    //
    // Stage
    //
    WorldRenderer.prototype.createStage = function (id) {
        var $world = $("#" + id);

        return new Kinetic.Stage({
            container: id,
            width: $world.innerWidth(),
            height: $world.innerHeight(),
        });
    };

    //
    // Background
    //
    WorldRenderer.prototype.createBackground = function() {
        var
        width = this.stage.getWidth(),
        height = this.stage.getHeight(),
        center = { x: width / 2, y: height /2 },
        background = new Kinetic.Layer({
            opacity: 0.0,
        }),
        fill = new Kinetic.Rect({
            x: 0, y: 0,
            width: width, height: height,
            fillLinearGradientStartPoint: [center.x, 0],
            fillLinearGradientEndPoint: [center.x, height],
            fillLinearGradientColorStops: [0, '#05011A', 1, '#0C0140']
        }),
        hill = new Kinetic.Ellipse({
            x: center.x, y: height,
            width: width*2, height: height * 0.4,
            fill: "#040112"
        });

        background.add(fill);

        for (var i = 0; i < 100; i++) {
            var star = new Kinetic.Circle({
                x: Math.random() * width,
                y: Math.random() * center.y,
                width: 1,
                height: 1,
                stroke: "white"
                
            });
            background.add(star);
        }

        background.add(hill);

        return background;
    };

    //
    // WorldBoard
    //
    WorldRenderer.prototype.createWorldBoard = function () {

        var self   = this,
            width  = this.stage.getWidth(),
            height = this.stage.getHeight(),
            border = Math.max(Math.max(width * 0.05, height * 0.05), 10),
            layer  = new Kinetic.Layer({ opacity: 0.0, draggable: true });

        this.squareSize = Math.max((width - border * 2) / this.viewModel.size.x(), (height - border * 2) / this.viewModel.size.y());

        var board = new Kinetic.Rect({
                x: border, y: border,
                width: this.viewModel.size.x(), height: this.viewModel.size.y(),
                scale: this.squareSize,
                fill: "#ccc",
                shadowColor: "white",
                shadowBlur: 100,
                shadowOffset: [0, 0],
                shadowOpacity: 0.7
            }),
            addAxis = function (points) {
                var axis = new Kinetic.Line({
                    points: points,
                    stroke: "#999",
                    strokeWidth: 0.5,
                    drawHitFunc: function (){}
                });
                layer.add(axis);
            };

        $(window).on("mousewheel", function(e) {
            var scale = self.worldBoard.getScale(),
                delta = e.originalEvent.wheelDelta;

            if (delta < 0) {
                self.zoom = Math.max(self.zoom-0.1, 0.7)
            } else {
                self.zoom = Math.min(self.zoom+0.1, 1.5)
            }
            self.worldBoard.setScale({
                x: self.zoom,
                y: self.zoom
            });
            self.worldBoard.draw();
        });

        layer.add(board);

        for (var x = 1; x < this.viewModel.size.x(); x++) {
            addAxis([
                border, border + (x*this.squareSize),
                border + (this.viewModel.size.y()*this.squareSize), border + (x*this.squareSize)
            ]);
        }

        for (var y = 1; y < this.viewModel.size.y(); y++) {
            addAxis([
                border + (y*this.squareSize), border,
                border + (y*this.squareSize), border + (this.viewModel.size.x()*this.squareSize)
            ]);
        }

        return layer;
    };

    return WorldRenderer;
});