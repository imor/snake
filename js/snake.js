var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

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

function Cell(graphics, position, size) {
    this._graphics = graphics;
    this._position = position;
    this._size = size;

    Cell.prototype.getGraphics = function() {
        return this._graphics;
    };

    Cell.prototype.getPosition = function() {
        return this._position;
    };

    Cell.prototype.getSize = function() {
        return this._size;
    };

    Cell.prototype.draw = function(position, cellColor, borderColor, borderWidth) {
        var position = position || this._position;
        cellColor = cellColor || 0xd4d4d4;
        borderColor = borderColor || 0xffffff;
        borderWidth = borderWidth || 1;

        this._graphics.beginFill(cellColor);
        this._graphics.lineStyle(borderWidth, borderColor);

        var x = position.getX();
        var y = position.getY();
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

function Segment(graphics, headCell, direction, numberOfCells) {
    this._headCell = headCell;
    this._direction = direction;
    this._graphics = graphics;
    this._cells = [];
    this._cells.push(headCell);
    var position = this._headCell.getPosition();
    var size = headCell.getSize();
    for (var i = 1;i < numberOfCells;i++) {
        position = getAdjacentCellPosition(position, headCell, direction);
        this._cells.push(new Cell(graphics, position, size));
    }

    stage.addChild(graphics);

    Segment.prototype.addCell = function() {
        var lastCell = _cells[_cells.length - 1];
        var position = getAdjacentCellPosition(lastCell.getPosition(), lastCell, this._direction);
        this._cells.push(new Cell(this._graphics, position, lastCell.getSize()));
    };

    Segment.prototype.removeCell = function() {
        this._cells.pop();
    };

    Segment.prototype.getLength = function() {
        return this._cells.length;
    }

    Segment.prototype.getHeadCell = function() {
        return this._headCell;
    };

    Segment.prototype.getDirection = function() {
        return this._direction;
    };

    Segment.prototype.getGraphics = function() {
        return this._graphics;
    };

    Segment.prototype.draw = function() {
        this._cells.forEach(function(cell) {
            cell.draw();
        });
    }

    Segment.prototype.update = function(lag) {
        this._graphics.position.x += this._headCell.getSize();
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
