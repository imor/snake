// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x000000);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();

function drawCell(x, y, side, cellColor, borderColor, borderWidth) {
    cellColor = cellColor || 0xFF0000;
    borderColor = borderColor || 0x00FF00;
    borderWidth = borderWidth || 1;
    
    graphics.beginFill(cellColor);
    graphics.lineStyle(borderWidth, borderColor);

    // draw a shape
    graphics.moveTo(x, y);
    graphics.lineTo(x + side, y);
    graphics.lineTo(x + side, y + side);
    graphics.lineTo(x, y + side);
    graphics.lineTo(x, y);
    graphics.endFill();
}

drawCell(10, 10, 10);

stage.addChild(graphics);

requestAnimFrame( animate );

function animate() {

    requestAnimFrame( animate );

    // render the stage   
    renderer.render(stage);
}