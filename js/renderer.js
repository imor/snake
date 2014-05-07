// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var snake = new Snake(5);
var segment = new Segment(new Point(60, 10), RIGHT, 3);
snake.addSegment(segment);
var segment = new Segment(new Point(40, 30), DOWN, 3);
snake.addSegment(segment);
var world = new World(Date.now());
world.addEntity(snake);
world.draw();

requestAnimFrame(animate);

function animate() {
    requestAnimFrame(animate);

    world.update();
    // render the stage
    renderer.render(stage);
}
