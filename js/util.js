function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPoint() {
    return new Point(generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE, generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE);
}

function generateFood() {
    while (true) {
        var randomPoint = generateRandomPoint();
        var cell = GRID.getCell(randomPoint);
        if (cell && cell.getCellType() === CELL_TYPE.SNAKE) {
            continue;
        }
        return new Cell(randomPoint, CELL_SIZE, CELL_TYPE.FOOD, 0x141414);
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
