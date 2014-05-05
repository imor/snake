var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

function Cell(size) {
    var _size = size;

    Cell.prototype.getSize = function() {
        return _size;
    };
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

function Segment(headPosition, headCell, direction, numberOfCells) {
    var _headPosition = headPosition;
    var _headCell = headCell;
    var _direction = direction;
    var _numberOfCells = numberOfCells;

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
}

function Snake() {
    var _segments = [];
}
