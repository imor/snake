// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer_size = NUMBER_OF_CELLS * CELL_SIZE;
var renderer = PIXI.autoDetectRenderer(renderer_size, renderer_size);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var world;

function start() {
    GRID.init();
    world = new World();
    world.addEntity("snake", new Snake(new Point(30, 0), DIRECTION.RIGHT, 5));
    world.addEntity("food", FOOD.generate());
    world.draw();
}

function restart() {
    world.destroy();
    GRID.init();
    start();
}

start();

requestAnimFrame(animate);

function animate() {
    requestAnimFrame(animate);

    world.update();
    // render the stage
    renderer.render(stage);
}
