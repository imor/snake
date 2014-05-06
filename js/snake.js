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

function Cell(graphics, size) {
    var _size = size;
    var _graphics = graphics;

    Cell.prototype.getSize = function() {
        return _size;
    };

    Cell.prototype.getGraphics = function() {
        return _graphics;
    };

    Cell.prototype.draw = function(position, cellColor, borderColor, borderWidth) {
        cellColor = cellColor || 0xd4d4d4;
        borderColor = borderColor || 0xffffff;
        borderWidth = borderWidth || 1;

        _graphics.beginFill(cellColor);
        _graphics.lineStyle(borderWidth, borderColor);

        var x = position.getX();
        var y = position.getY();
        var side = this.getSize();
        // draw a shape
        _graphics.moveTo(x, y);
        _graphics.lineTo(x + side, y);
        _graphics.lineTo(x + side, y + side);
        _graphics.lineTo(x, y + side);
        _graphics.lineTo(x, y);
        _graphics.endFill();
    }

    Cell.prototype.update = function(lag) {
    }
}

function Point(x, y) {
    var _x = x;
    var _y = y;

    Point.prototype.getX = function() {
        return _x;
    };

    Point.prototype.getY = function() {
        return _y;
    };
}

function Segment(graphics, headPosition, headCell, direction, numberOfCells, stepsPerSecond) {
    var _headPosition = headPosition;
    var _headCell = headCell;
    var _direction = direction;
    var _numberOfCells = numberOfCells;
    var _graphics = graphics;
    var _updateInterval = 1000 / stepsPerSecond;
    var _timeSinceLastUpdate = 0;

    stage.addChild(graphics);

    Segment.prototype.addCell = function() {
        _numberOfCells = _numberOfCells + 1;
    };

    Segment.prototype.removeCell = function() {
        _numberOfCells = _numberOfCells - 1;
    };

    Segment.prototype.getLength = function() {
        return _numberOfCells;
    }

    Segment.prototype.getHeadPosition = function() {
        return _headPosition;
    };

    Segment.prototype.getHeadCell = function() {
        return _headCell;
    };

    Segment.prototype.getDirection = function() {
        return _direction;
    };

    Segment.prototype.getGraphics = function() {
        return _graphics;
    };

    Segment.prototype.draw = function() {
        var headCell = this.getHeadCell();
        var size = headCell.getSize();
        var position = this.getHeadPosition();
        var direction= getOppositeDirection(this.getDirection());

        headCell.draw(position);
        for (var i = 1;i < this.getLength();i++) {
            position = getAdjacentCellPosition(position, headCell, direction);
            headCell.draw(position);
        }
    }

    Segment.prototype.update = function(lag) {
        _timeSinceLastUpdate = _timeSinceLastUpdate + lag;

        if (_timeSinceLastUpdate >= _updateInterval) {
            _graphics.position.x += _headCell.getSize();
            _timeSinceLastUpdate = 0;
        }
    }
}

function Snake() {
    var _segments = [];

    Snake.prototype.addSegment = function(segment) {
        _segments.push(segment);
    }

    Snake.prototype.draw = function() {
        _segments.forEach(function(segment) {
            segment.draw();
        });
    }

    Snake.prototype.update = function(lag) {
        _segments.forEach(function(segment) {
            segment.update(lag);
        });
    };
}
