var FOOD = (function() {
    var my = {};

    my.generate = function() {
        while (true) {
            var randomPoint = generateRandomPoint();
            var cell = GRID.getCell(randomPoint);
            if (cell && cell.getCellType() === CELL_TYPE.SNAKE) {
                continue;
            }
            return new Cell(randomPoint, CELL_SIZE, CELL_TYPE.FOOD, 0x141414);
        }
    };

    return my;
}());
