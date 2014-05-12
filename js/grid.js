var NUMBER_OF_CELLS = 10;
var CELL_SIZE = 10;

//directions
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

//cell types
var EMPTY = 0;
var SNAKE = 1;
var WALL = 2;
var FOOD = 3;

var positionToCell = new Array(NUMBER_OF_CELLS);
for (var i = 0;i < NUMBER_OF_CELLS;i++) {
    var arr = new Array(NUMBER_OF_CELLS);
    positionToCell[i] = arr;
    for (var j = 0;j < NUMBER_OF_CELLS;j++) {
        arr[j] = null;
    }
}

function getAdjacentCellPosition(cell, direction) {
    var size = cell.getSize();
    var position = cell.getPosition();
    if (direction == UP) {
        var newY = position.getY() - size;
        if (newY < 0) {
            newY = newY + NUMBER_OF_CELLS * CELL_SIZE;
        }
        return new Point(position.getX(), newY);
    } else if (direction == RIGHT) {
        var newX = position.getX() + size;
        if (newX >= NUMBER_OF_CELLS * CELL_SIZE) {
            newX = newX - NUMBER_OF_CELLS * CELL_SIZE;
        }
        return new Point(newX, position.getY());
    } else if (direction == DOWN) {
        var newY = position.getY() + size;
        if (newY >= NUMBER_OF_CELLS * CELL_SIZE) {
            newY = newY - NUMBER_OF_CELLS * CELL_SIZE;
        }
        return new Point(position.getX(), newY);
    } else if (direction == LEFT) {
        var newX = position.getX() - size;
        if (newX < 0) {
            newX = newX + NUMBER_OF_CELLS * CELL_SIZE;
        }
        return new Point(newX, position.getY());
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

function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPoint() {
    return new Point(generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE, generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE);
}

//TODO:Food should not be generated on top of the snake
function generateFood() {

    while (true) {
        var randomPoint = generateRandomPoint();
        var cell = getCellOnGrid(randomPoint);
        if (cell && cell.getCellType() === SNAKE) {
            continue;
        }
        return new Cell(randomPoint, CELL_SIZE, FOOD, 0x141414);
    }
}

var foodX = 0;
var foodY = 0;

function setCellOnGrid(cell) {
    var position = cell.getPosition();
    var i = position.getX() / CELL_SIZE;
    var j = position.getY() / CELL_SIZE;
    positionToCell[i][j] = cell;
}

function removeCellOnGrid(cell) {
    var position = cell.getPosition();
    var i = position.getX() / CELL_SIZE;
    var j = position.getY() / CELL_SIZE;
    positionToCell[i][j] = null;
}

function getCellOnGrid(position) {
    var i = position.getX() / CELL_SIZE;
    var j = position.getY() / CELL_SIZE;
    return positionToCell[i][j];
}
