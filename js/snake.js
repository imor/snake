'use strict';
var INITIAL_SNAKE_LENGTH = 3;
var INPUT_BUFFER_SIZE = 2;

function Snake(startX, startY, direction, spriteKey, upKey, rightKey, downKey, leftKey) {
    this.direction = direction;
    this.inputBuffer = [];
    this.snakeCells = [];
    this.snakeSpeed = 5;
    this.spriteKey = spriteKey;
    this.upKey = upKey;
    this.rightKey = rightKey;
    this.downKey = downKey;
    this.leftKey = leftKey;

    var oppositeDirection = getOppositeDirection(direction);
    var nextPosition = {x:startX, y:startY};
    for (var i = 0;i < INITIAL_SNAKE_LENGTH;i++) {
        this.snakeCells.push(game.add.sprite(nextPosition.x, nextPosition.y, this.spriteKey));
        nextPosition = getAdjacentCellPosition(nextPosition.x, nextPosition.y, CELL_WIDTH, oppositeDirection);
    }

    Snake.prototype.move = function() {
        var head = this.snakeCells[0];
        var newDirection = this.inputBuffer.shift();
        if (!newDirection) {
            newDirection = this.direction;
        }
        var nextPosition = getAdjacentCellPosition(head.x, head.y, CELL_WIDTH, newDirection);
        if (isFoodLocation(nextPosition.x, nextPosition.y)) {
            this.snakeCells.unshift(game.add.sprite(nextPosition.x, nextPosition.y, this.spriteKey));
            var foodLocation = createFoodLocation();
            food.x = foodLocation.x;
            food.y = foodLocation.y;
            snakeAteFood(this);
        } else if (isSnakeLocation(nextPosition.x, nextPosition.y)) {
            snakeDied(this);
            return;
        }

        var last = this.snakeCells.pop();
        last.x = nextPosition.x;
        last.y = nextPosition.y;
        this.snakeCells.unshift(last);
        this.direction = newDirection;

        if (this.isComputerController) {
            this.findPath();
        }
    };

    Snake.prototype.findPath = function() {
        var randomInt = game.rnd.integerInRange(1, 100);
        if (randomInt >= 50) {
            return;
        }
        var grid = new PF.Grid(NUMBER_OF_GAME_CELLS, NUMBER_OF_GAME_CELLS);
        Object.keys(snakes).forEach(function(key) {
            var snake = snakes[key];
            var length = snake.snakeCells.length;
            for (var i = 0;i < length;i++) {
                var currentCell = snake.snakeCells[i];
                var x = currentCell.x / CELL_WIDTH;
                var y = currentCell.y / CELL_WIDTH;
                grid.setWalkableAt(x, y, false);
            }
        });

        var finder = new PF.AStarFinder();
        var finder = new PF.AStarFinder({
            wrapAround: true
        });
        var head = this.snakeCells[0];
        var fromX = head.x / CELL_WIDTH;
        var fromY = head.y / CELL_WIDTH;
        var toX = food.x / CELL_WIDTH;
        var toY = food.y / CELL_WIDTH;
        var path = finder.findPath(fromX, fromY, toX, toY, grid);
        if (path && path.length > 1) {
            var next = path[1];
            var nextDirection = getDirectionFromTwoPositions(fromX, fromY, next[0], next[1]);
            this.handleKeyPressed(nextDirection);
        }
    };

    Snake.prototype.handleKeyPressed = function(keyPressedDirection) {
        var newDirection;
        var oldDirection = this.direction;
        if (this.inputBuffer.length > 0) {
            oldDirection = this.inputBuffer[this.inputBuffer.length - 1];
        }
        if (oldDirection != getOppositeDirection(keyPressedDirection)) {
            newDirection = keyPressedDirection;
        }
        if (newDirection && this.inputBuffer.length < INPUT_BUFFER_SIZE) {
            this.inputBuffer.push(newDirection);
        }
    };

    Snake.prototype.onUpArrowKeyPressed = function() {
        this.handleKeyPressed(DIRECTION.UP);
    };

    Snake.prototype.onRightArrowKeyPressed = function () {
        this.handleKeyPressed(DIRECTION.RIGHT);
    };

    Snake.prototype.onDownArrowKeyPressed = function() {
        this.handleKeyPressed(DIRECTION.DOWN);
    };

    Snake.prototype.onLeftArrowKeyPressed = function() {
        this.handleKeyPressed(DIRECTION.LEFT);
    };

    Snake.prototype.isSnakeLocation = function(x, y) {
        var length = this.snakeCells.length;
        for (var i = 0;i < length;i++) {
            var cell = this.snakeCells[i];
            if (cell.x === x && cell.y === y) {
                return true;
            }
        }
        return false;
    };

    Snake.prototype.restartTimer = function() {
        game.time.events.remove(this.timer);
        this.timer = game.time.events.loop(Phaser.Timer.SECOND / this.snakeSpeed, this.move, this);
    };

    Snake.prototype.destroy = function() {
        var length = this.snakeCells.length;
        for (var i = 0;i < length;i++) {
            this.snakeCells[i].destroy();
        }
        game.time.events.remove(this.timer);

        if (!this.isComputerController) {
            this.upArrowKey.onDown.remove(this.onUpArrowKeyPressed, this);
            this.rightArrowKey.onDown.remove(this.onRightArrowKeyPressed, this);
            this.downArrowKey.onDown.remove(this.onDownArrowKeyPressed, this);
            this.leftArrowKey.onDown.remove(this.onLeftArrowKeyPressed, this);

            game.input.keyboard.removeKey(this.upKey);
            game.input.keyboard.removeKey(this.rightKey);
            game.input.keyboard.removeKey(this.downKey);
            game.input.keyboard.removeKey(this.leftKey);
        }
    };

    this.timer = game.time.events.loop(Phaser.Timer.SECOND / this.snakeSpeed, this.move, this);

    if (upKey && rightKey && downKey && leftKey) {
        this.upArrowKey = game.input.keyboard.addKey(upKey);
        this.upArrowKey.onDown.add(this.onUpArrowKeyPressed, this);
        this.rightArrowKey = game.input.keyboard.addKey(rightKey);
        this.rightArrowKey.onDown.add(this.onRightArrowKeyPressed, this);
        this.downArrowKey = game.input.keyboard.addKey(downKey);
        this.downArrowKey.onDown.add(this.onDownArrowKeyPressed, this);
        this.leftArrowKey = game.input.keyboard.addKey(leftKey);
        this.leftArrowKey.onDown.add(this.onLeftArrowKeyPressed, this);

        this.isComputerController = false;
    } else {
        this.isComputerController = true;
    }
}
