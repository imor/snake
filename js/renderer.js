// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer_size = NUMBER_OF_CELLS * CELL_SIZE;
var renderer = PIXI.autoDetectRenderer(renderer_size, renderer_size);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var snake = new Snake(new Point(30, 0), RIGHT, 10);
var world = new World();
var food = generateFood();
world.addEntity(snake);
world.addEntity(food);
world.draw();

requestAnimFrame(animate);

function animate() {
    requestAnimFrame(animate);

    world.update();
    // render the stage
    renderer.render(stage);
}
