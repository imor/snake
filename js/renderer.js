// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();
var segment = new Segment(graphics, new Point(40, 10), new Cell(graphics, 10), RIGHT, 3, 10);
var snake = new Snake();
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
