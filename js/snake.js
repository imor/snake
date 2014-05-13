function Snake(position, direction, stepsPerSecond) {
    this._segments = [];
    this._updateInterval = 1000 / stepsPerSecond;
    this._timeSinceLastUpdate = 0;
    this._direction = direction;
    this._directionBuffer = [];
    this._inputBufferSize = 2;

    var segment = new Segment(position, direction, 3);
    this._segments.push(segment);
    var snake = this;

    var listener = new window.keypress.Listener();
    listener.simple_combo("up", function() {
        snake.setDirection(DIRECTION.UP);
    });
    listener.simple_combo("right", function() {
        snake.setDirection(DIRECTION.RIGHT);
    });
    listener.simple_combo("down", function() {
        snake.setDirection(DIRECTION.DOWN);
    });
    listener.simple_combo("left", function() {
        snake.setDirection(DIRECTION.LEFT);
    });

    Snake.prototype.draw = function() {
        this._segments.forEach(function(segment) {
            segment.draw();
        });
    };

    Snake.prototype.destroy = function() {
        this._segments.forEach(function(segment) {
            segment.destroy();
        });
    };

    Snake.prototype.setDirection = function(newDirection) {
        //Only allow turning left or right not forward or backward
        if (this._direction != newDirection &&
            GRID.getOppositeDirection(this._direction) != newDirection &&
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
    };

    Snake.prototype._moveOneStep = function() {
        //Move one step forward
        var firstSegment = this._segments[0];
        var firstCell = firstSegment.getCell(0);
        var lastSegment = this._segments[this._segments.length - 1];

        var position = GRID.getAdjacentCellPosition(firstCell, firstSegment.getDirection());
        var cell = GRID.getCell(position);
        if (cell && cell.getCellType() === CELL_TYPE.FOOD) {
            //TODO:Remove food from world
            cell.destroy();
            GRID.removeCell(cell);
            this._elongateOneStep();
            var food = FOOD.generate();
            food.draw();
            world.addEntity("food", food);
        }
        else if (cell && (cell.getCellType() === CELL_TYPE.SNAKE || cell.getCellType() === CELL_TYPE.WALL)) {
            restart();
        } else {
            var lastCell = lastSegment.removeCellFromBack();
            lastCell.setPosition(position);
            firstSegment.addCellToFront(lastCell);
            lastCell.draw();

            if (lastSegment.getLength() === 0) {
                this._segments.pop();
            }
        }
    };

    Snake.prototype._elongateOneStep = function() {
        var firstSegment = this._segments[0];
        var firstCell = firstSegment.getCell(0);
        var position = GRID.getAdjacentCellPosition(firstCell, firstSegment.getDirection());
        var newCell = new Cell(position, CELL_SIZE, CELL_TYPE.SNAKE);
        firstSegment.addCellToFront(newCell);
        newCell.draw();
    };
}
