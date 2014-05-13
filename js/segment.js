function Segment(position, direction, numberOfCells) {
    this._direction = direction;
    this._cells = [];
    for (var i = 0;i < numberOfCells;i++) {
        var currentCell = new Cell(position, CELL_SIZE, CELL_TYPE.SNAKE);
        this._cells.push(currentCell);
        position = GRID.getAdjacentCellPosition(currentCell, GRID.getOppositeDirection(direction));
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
    };

    Segment.prototype.getCell = function(index) {
        return this._cells[index];
    };

    Segment.prototype.getDirection = function(index) {
        return this._direction;
    };

    Segment.prototype.draw = function() {
        this._cells.forEach(function(cell) {
            cell.draw();
        });
    };

    Segment.prototype.destroy = function() {
        this._cells.forEach(function(cell) {
            cell.destroy();
        });
    };

    Segment.prototype.update = function(lag) {
    };
}
