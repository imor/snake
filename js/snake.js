function Cell(position, size, cellType, cellColor, borderColor, borderWidth) {
    this._graphics = new PIXI.Graphics();
    stage.addChild(this._graphics);
    this._position = position;
    this._size = size;
    this._cellType = cellType;
    this._cellColor = cellColor || 0xd4d4d4;
    this._borderColor = borderColor || 0xffffff;
    this._borderWidth = borderWidth || 1;

    Cell.prototype.getPosition = function() {
        return this._position;
    };

    Cell.prototype.setPosition = function(newPosition) {
        //HACK:I don't like setting position twice. Once in _position and once in _graphics
        removeCellOnGrid(this);
        this._position = newPosition;
        this._graphics.position.x = newPosition.getX();
        this._graphics.position.y = newPosition.getY();
        setCellOnGrid(this);
    };

    Cell.prototype.getSize = function() {
        return this._size;
    };

    Cell.prototype.getCellColor = function() {
        return this._cellColor;
    };

    Cell.prototype.setCellColor = function(cellColor) {
        this._cellColor = cellColor;
    };

    Cell.prototype.draw = function() {

        this._graphics.beginFill(this._cellColor);
        this._graphics.lineStyle(this._borderWidth, this._borderColor);

        var side = this.getSize();
        // draw a shape
        this._graphics.moveTo(0, 0);
        this._graphics.lineTo(side, 0);
        this._graphics.lineTo(side, side);
        this._graphics.lineTo(0, side);
        this._graphics.lineTo(0, 0);
        this._graphics.endFill();

        this._graphics.position.x = this._position.getX();
        this._graphics.position.y = this._position.getY();
    }

    Cell.prototype.destroy = function() {
        this._graphics.clear();
    }

    Cell.prototype.update = function(lag) {
    }

    Cell.prototype.getCellType = function() {
        return this._cellType;
    }

    setCellOnGrid(this);
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

function Segment(position, direction, numberOfCells) {
    this._direction = direction;
    this._cells = [];
    for (var i = 0;i < numberOfCells;i++) {
        var currentCell = new Cell(position, CELL_SIZE, SNAKE);
        this._cells.push(currentCell);
        position = getAdjacentCellPosition(currentCell, getOppositeDirection(direction));
    }

    Segment.prototype.addCellToFront = function(cell) {
        this._cells.unshift(cell);
    };

    Segment.prototype.addCellToBack = function(cell) {
        this._cells.push(cell);
    };

    Segment.prototype.removeCellFromFront = function() {
        return this._cells.shift();
    };

    Segment.prototype.removeCellFromBack = function() {
        return this._cells.pop();
    };

    Segment.prototype.getLength = function() {
        return this._cells.length;
    }

    Segment.prototype.getCell = function(index) {
        return this._cells[index];
    }

    Segment.prototype.getDirection = function(index) {
        return this._direction;
    }

    Segment.prototype.draw = function() {
        this._cells.forEach(function(cell) {
            cell.draw();
        });
    }

    Segment.prototype.destroy = function() {
        this._cells.forEach(function(cell) {
            cell.destroy();
        });
    }

    Segment.prototype.update = function(lag) {
    }
}

function Snake(position, direction, stepsPerSecond) {
    this._segments = [];
    this._updateInterval = 1000 / stepsPerSecond;
    this._timeSinceLastUpdate = 0;
    this._direction = direction;
    this._directionBuffer = []
    this._inputBufferSize = 2;

    var segment = new Segment(position, direction, 3);
    this._segments.push(segment);
    var snake = this;

    var listener = new window.keypress.Listener();
    listener.simple_combo("up", function() {
        snake.setDirection(UP);
    });
    listener.simple_combo("right", function() {
        snake.setDirection(RIGHT);
    });
    listener.simple_combo("down", function() {
        snake.setDirection(DOWN);
    });
    listener.simple_combo("left", function() {
        snake.setDirection(LEFT);
    });

    Snake.prototype.draw = function() {
        this._segments.forEach(function(segment) {
            segment.draw();
        });
    }

    Snake.prototype.destroy = function() {
        this._segments.forEach(function(segment) {
            segment.destroy();
        });
    }

    Snake.prototype.setDirection = function(newDirection) {
        //Only allow turning left or right not forward or backward
        if (this._direction != newDirection &&
            getOppositeDirection(this._direction) != newDirection &&
            this._directionBuffer.length <= this._inputBufferSize) {
            this._direction = newDirection;
            this._directionBuffer.push(newDirection);
        }
    };

    Snake.prototype.update = function(lag) {
        this._timeSinceLastUpdate = this._timeSinceLastUpdate + lag;

        if (this._timeSinceLastUpdate >= this._updateInterval) {
            this._updateDirection();
            this._moveOneStep();
            this._timeSinceLastUpdate = 0;
        }
    };

    Snake.prototype._updateDirection = function() {
        //Set new direction
        var direction = this._directionBuffer.shift();
        if (direction) {
            var firstSegment = this._segments[0];
            var firstCell = firstSegment.removeCellFromFront();
            var newSegment = new Segment(firstCell.getPosition(), direction, 0);
            newSegment.addCellToFront(firstCell);
            this._segments.unshift(newSegment);
        }
    }

    Snake.prototype._moveOneStep = function() {
        //Move one step forward
        var firstSegment = this._segments[0];
        var firstCell = firstSegment.getCell(0);
        var lastSegment = this._segments[this._segments.length - 1];

        var position = getAdjacentCellPosition(firstCell, firstSegment.getDirection());
        var cell = getCellOnGrid(position);
        if (cell && cell.getCellType() === FOOD) {
            //TODO:Remove food from world
            cell.destroy();
            removeCellOnGrid(cell);
            this._elongateOneStep();
            food = generateFood();
            food.draw();
        }
        else if (cell && (cell.getCellType() === SNAKE || cell.getCellType() === WALL)) {
            reinit();
        } else {
            var lastCell = lastSegment.removeCellFromBack();
            lastCell.setPosition(position);
            firstSegment.addCellToFront(lastCell);
            lastCell.draw();

            if (lastSegment.getLength() === 0) {
                this._segments.pop();
            }
        }
    }

    Snake.prototype._elongateOneStep = function() {
        var firstSegment = this._segments[0];
        var firstCell = firstSegment.getCell(0);
        var position = getAdjacentCellPosition(firstCell, firstSegment.getDirection());
        var newCell = new Cell(position, CELL_SIZE, SNAKE);
        firstSegment.addCellToFront(newCell);
        newCell.draw();
    }
}
