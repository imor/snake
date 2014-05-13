var CELL_TYPE = {
    EMPTY: 0,
    SNAKE: 1,
    WALL: 2,
    FOOD: 3
};

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
        GRID.removeCell(this);
        this._position = newPosition;
        this._graphics.position.x = newPosition.getX();
        this._graphics.position.y = newPosition.getY();
        GRID.setCell(this);
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
    };

    Cell.prototype.destroy = function() {
        this._graphics.clear();
    };

    Cell.prototype.update = function(lag) {
    };

    Cell.prototype.getCellType = function() {
        return this._cellType;
    };

    GRID.setCell(this);
}
