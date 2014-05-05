function drawCell(position, side, cellColor, borderColor, borderWidth) {
    cellColor = cellColor || 0xd4d4d4;
    borderColor = borderColor || 0xffffff;
    borderWidth = borderWidth || 1;

    graphics.beginFill(cellColor);
    graphics.lineStyle(borderWidth, borderColor);

    var x = position.getX();
    var y = position.getY();
    // draw a shape
    graphics.moveTo(x, y);
    graphics.lineTo(x + side, y);
    graphics.lineTo(x + side, y + side);
    graphics.lineTo(x, y + side);
    graphics.lineTo(x, y);
    graphics.endFill();
}

function getAdjacentCellPosition(position, cell, direction) {
    var size = cell.getSize();
    if (direction == UP) {
        return new Point(position.getX(), position.getY() - size);
    } else if (direction == RIGHT) {
        return new Point(position.getX() + size, position.getY());
    } else if (direction == DOWN) {
        return new Point(position.getX(), position.getY() + size);
    } else if (direction == LEFT) {
        return new Point(position.getX() - size, position.getY());
    }
}

function getOppositeDirection(direction) {
    if (direction == UP) {
        return DOWN;
    } else if (direction == RIGHT) {
        return LEFT;
    } else if (direction == DOWN) {
        return UP;
    } else if (direction == LEFT) {
        return RIGHT;
    }
}

function drawSegment(segment) {
    var headCell = segment.getHeadCell();
    var size = headCell.getSize();
    var position = segment.getHeadPosition();
    var direction= getOppositeDirection(segment.getDirection());

    drawCell(position, size);
    for (var i = 1;i < segment.getLength();i++) {
        position = getAdjacentCellPosition(position, headCell, direction);
        drawCell(position, size);
    }
}

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xffffff);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();

var segment = new Segment(new Point(40, 10), new Cell(10), RIGHT, 3);
drawSegment(segment);

stage.addChild(graphics);

requestAnimFrame( animate );

function animate() {

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
    graphics.position.x += 10;
}
