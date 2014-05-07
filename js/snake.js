var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

function getAdjacentCellPosition(cell, direction) {
    var size = cell.getSize();
    var position = cell.getPosition();
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

function Cell(position, size, cellColor, borderColor, borderWidth) {
    this._graphics = new PIXI.Graphics();
    stage.addChild(this._graphics);
    this._position = position;
    this._size = size;
    this._cellColor = cellColor || 0xd4d4d4;
    this._borderColor = borderColor || 0xffffff;
    this._borderWidth = borderWidth || 1;

    Cell.prototype.getPosition = function() {
        return this._position;
    };

    Cell.prototype.setPosition = function(newPosition) {
        //HACK:I don't like setting position twice. Once in _position and once in _graph
        this._position = newPosition;
        this._graphics.position.x = newPosition.getX();
        this._graphics.position.y = newPosition.getY();
    };

    Cell.prototype.getSize = function() {
        return this._size;
    };

    Cell.prototype.draw = function() {

        this._graphics.beginFill(this._cellColor);
        this._graphics.lineStyle(this._borderWidth, this._borderColor);

        var x = this._position.getX();
        var y = this._position.getY();
        var side = this.getSize();
        // draw a shape
        this._graphics.moveTo(x, y);
        this._graphics.lineTo(x + side, y);
        this._graphics.lineTo(x + side, y + side);
        this._graphics.lineTo(x, y + side);
        this._graphics.lineTo(x, y);
        this._graphics.endFill();
    }

    Cell.prototype.update = function(lag) {
        this._graphics.position.x += this._size;
    }
}

function Point(x, y) {
    this._x = x;
    this._y = y;

    Point.prototype.getX = function() {
        return this._x;
    };

    Point.prototype.getY = function() {
        return this._y;
    };
}

function Segment(direction, numberOfCells) {
    this._direction = direction;
    var headCell = new Cell(new Point(60, 10), 10, 0x949494);
    this._cells = [];
    this._cells.push(headCell);
    var position = headCell.getPosition();
    var size = headCell.getSize();
    var currentCell = headCell;
    for (var i = 1;i < numberOfCells;i++) {
        position = getAdjacentCellPosition(currentCell, getOppositeDirection(direction));
        currentCell = new Cell(position, size);
        this._cells.push(currentCell);
    }

    Segment.prototype.addCell = function() {
        var lastCell = this._cells[this._cells.length - 1];
        var position = getAdjacentCellPosition(lastCell, this._direction);
        this._cells.push(new Cell(position, lastCell.getSize()));
    };

    Segment.prototype.removeCell = function() {
        this._cells.pop();
    };

    Segment.prototype.getLength = function() {
        return this._cells.length;
    }

    Segment.prototype.draw = function() {
        this._cells.forEach(function(cell) {
            cell.draw();
        });
    }

    Segment.prototype.update = function(lag) {
        this._cells.forEach(function(cell) {
            cell.update();
        });
    }
}

function Snake(stepsPerSecond) {
    this._segments = [];
    this._updateInterval = 1000 / stepsPerSecond;
    this._timeSinceLastUpdate = 0;

    Snake.prototype.addSegment = function(segment) {
        this._segments.push(segment);
    }

    Snake.prototype.draw = function() {
        this._segments.forEach(function(segment) {
            segment.draw();
        });
    }

    Snake.prototype.update = function(lag) {
        this._timeSinceLastUpdate = this._timeSinceLastUpdate + lag;

        if (this._timeSinceLastUpdate >= this._updateInterval) {
            this._segments.forEach(function(segment) {
                segment.update(lag);
            });
            this._timeSinceLastUpdate = 0;
        }
    };
}
