﻿define(["jquery", "kinetic", "knockout"], function ($, Kinetic, ko) {
    
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
        
        this.viewModel          = viewModel;
        this.stage              = this.createStage("world");
        this.background         = this.createBackground();
        this.worldBoardLayer    = new Kinetic.Layer();
        this.worldBoard         = this.createWorldBoard();
        this.zoom               = 1.0;

        this.renderBuildings();
        this.worldBoard.add(this.buildings);

        this.worldBoardLayer.add(this.worldBoard);
        this.stage.add(this.background);
        this.stage.add(this.worldBoardLayer);

        $(window).on("mousewheel", function(e) {
            var scale = self.worldBoardLayer.getScale(),
                delta = e.originalEvent.wheelDelta;

            if (delta < 0) {
                self.zoom = Math.max(self.zoom-0.1, 0.7)
            } else {
                self.zoom = Math.min(self.zoom+0.1, 1.5)
            }
            self.worldBoardLayer.setScale({
                x: self.zoom,
                y: self.zoom
            });
            self.worldBoardLayer.draw();
        });

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

        var self      = this,
            width     = this.stage.getWidth(),
            height    = this.stage.getHeight(),
            border    = Math.max(Math.max(width * 0.05, height * 0.05), 10),
            container = new Kinetic.Group({ x: border, y: border, opacity: 0, draggable: true });

        this.squareSize = Math.max((width - border * 2) / this.viewModel.size.x(), (height - border * 2) / this.viewModel.size.y());

        var board = new Kinetic.Rect({
                x: 0, y: 0,
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
                container.add(axis);
                axis.setZIndex(1000);
            };

        container.add(board);
        board.setZIndex(1000);

        board.on("mousedown", function () {
            if (self.selectedBuilding) {
                self.selectedBuilding.isEditing(false);
                self.selectedBuilding = null;
                container.setDraggable(true);
            }
        });

        for (var x = 1; x < this.viewModel.size.x(); x++) {
            addAxis([
                0, (x*this.squareSize),
                (this.viewModel.size.y()*this.squareSize), (x*this.squareSize)
            ]);
        }

        for (var y = 1; y < this.viewModel.size.y(); y++) {
            addAxis([
                (y*this.squareSize), 0,
                (y*this.squareSize), (this.viewModel.size.x()*this.squareSize)
            ]);
        }

        //layer.add(container);

        return container;
    };

    //
    // Building
    //
    WorldRenderer.prototype.createBuilding = function (building) {
        var self = this,
            building = new Kinetic.Rect({
                x: building.position.x() * this.squareSize, y: building.position.y() * this.squareSize,
                width: building.size.x(), height: building.size.y(),
                scale: this.squareSize,
                fill: "#eee",
                dragBoundFunc: function (pos) {
                    var containerPosition = building.getParent().getAbsolutePosition(),
                        scale = self.squareSize * self.zoom,
                        gridPos = {
                            x: pos.x - ((pos.x - containerPosition.x) % scale),
                            y: pos.y - ((pos.y - containerPosition.y) % scale)
                        };

                    if (gridPos.x < containerPosition.x) {
                        gridPos.x = containerPosition.x;
                    }

                    if (gridPos.y < containerPosition.y) {
                        gridPos.y = containerPosition.y;
                    }

                    return gridPos;
                }
            });

        building.isEditing = function (isEditing) {
            if (isEditing && self.selectedBuilding) {
                self.selectedBuilding.isEditing(false);
            }

            building._isEditing = isEditing;
            building.setDraggable(isEditing);
            building.setFill(isEditing ? "black" : "#eee");
            building.setOpacity(isEditing ? 0.7 : 1.0);
            building.setZIndex(isEditing ? 1 : 100);
            building.getLayer().draw();

            if (isEditing) {
                self.selectedBuilding = building;
                self.worldBoard.setDraggable(false);
            }
        };

        building.on("click", function() {
            building.isEditing(!building._isEditing);
        });

        building.on("dragmove", function () {

        });
    

        return building;
    };
    WorldRenderer.prototype.renderBuildings = function () {
        this.buildings = this.buildings || new Kinetic.Group();
        this.buildings.removeChildren();

        var viewModelBuildings = this.viewModel.buildings();
        for (var i = 0; i < viewModelBuildings.length; i++) {
            this.buildings.add(this.createBuilding(viewModelBuildings[i]));
        }
    };

    return WorldRenderer;
});