// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();

drawCell(new Point(10, 10), 10);

stage.addChild(graphics);

requestAnimFrame( animate );

function animate() {

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}
