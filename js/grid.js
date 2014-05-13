var NUMBER_OF_CELLS = 40;
var CELL_SIZE = 10;

var DIRECTION = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var GRID = (function() {
    var grid = {};
    var positionToCell;

    grid.init = function () {
        positionToCell = new Array(NUMBER_OF_CELLS);
        for (var i = 0;i < NUMBER_OF_CELLS;i++) {
            var arr = new Array(NUMBER_OF_CELLS);
            positionToCell[i] = arr;
            for (var j = 0;j < NUMBER_OF_CELLS;j++) {
                arr[j] = null;
            }
        }
    };

    grid.getAdjacentCellPosition = function(cell, direction) {
        var size = cell.getSize();
        var position = cell.getPosition();
        var newX;
        var newY;
        if (direction == DIRECTION.UP) {
            newY = position.getY() - size;
            if (newY < 0) {
                newY = newY + NUMBER_OF_CELLS * CELL_SIZE;
            }
            return new Point(position.getX(), newY);
        } else if (direction == DIRECTION.RIGHT) {
            newX = position.getX() + size;
            if (newX >= NUMBER_OF_CELLS * CELL_SIZE) {
                newX = newX - NUMBER_OF_CELLS * CELL_SIZE;
            }
            return new Point(newX, position.getY());
        } else if (direction == DIRECTION.DOWN) {
            newY = position.getY() + size;
            if (newY >= NUMBER_OF_CELLS * CELL_SIZE) {
                newY = newY - NUMBER_OF_CELLS * CELL_SIZE;
            }
            return new Point(position.getX(), newY);
        } else if (direction == DIRECTION.LEFT) {
            newX = position.getX() - size;
            if (newX < 0) {
                newX = newX + NUMBER_OF_CELLS * CELL_SIZE;
            }
            return new Point(newX, position.getY());
        }
    };

    grid.getOppositeDirection = function(direction) {
        if (direction == DIRECTION.UP) {
            return DIRECTION.DOWN;
        } else if (direction == DIRECTION.RIGHT) {
            return DIRECTION.LEFT;
        } else if (direction == DIRECTION.DOWN) {
            return DIRECTION.UP;
        } else if (direction == DIRECTION.LEFT) {
            return DIRECTION.RIGHT;
        }
    };

    grid.setCell = function(cell) {
        var position = cell.getPosition();
        var i = position.getX() / CELL_SIZE;
        var j = position.getY() / CELL_SIZE;
        positionToCell[i][j] = cell;
    };

    grid.removeCell = function(cell) {
        var position = cell.getPosition();
        var i = position.getX() / CELL_SIZE;
        var j = position.getY() / CELL_SIZE;
        positionToCell[i][j] = null;
    };

    grid.getCell = function(position) {
        var i = position.getX() / CELL_SIZE;
        var j = position.getY() / CELL_SIZE;
        return positionToCell[i][j];
    };

    return grid;
}());
