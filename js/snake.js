var INITIAL_SNAKE_LENGTH = 3;
var INPUT_BUFFER_SIZE = 2;

function Snake(upKey, rightKey, downKey, leftKey, startX, startY, direction) {
    this.direction = direction;
    this.inputBuffer = [];
    this.snakeCells = [];
    this.snakeSpeed = 5;
    
    var oppositeDirection = getOppositeDirection(direction);
    var nextPosition = {x:startX, y:startY};
    for (var i = 0;i < INITIAL_SNAKE_LENGTH;i++) {
        this.snakeCells.push(game.add.sprite(nextPosition.x, nextPosition.y, 'cell'));
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
            this.snakeCells.unshift(game.add.sprite(nextPosition.x, nextPosition.y, 'cell'));
            var foodLocation = createFoodLocation();
            food.x = foodLocation.x;
            food.y = foodLocation.y;
        } else if (isSnakeLocation(nextPosition.x, nextPosition.y)) {
            restart();
            return;
        }

        var last = this.snakeCells.pop();
        last.x = nextPosition.x;
        last.y = nextPosition.y;
        this.snakeCells.unshift(last);
        this.direction = newDirection;
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
    
    Snake.prototype.kill = function() {
        var length = this.snakeCells.length;
        for (var i = 0;i < length;i++) {
            this.snakeCells[i].kill();
        }
    };
    
    game.time.events.loop(Phaser.Timer.SECOND / this.snakeSpeed, this.move, this);

    this.upArrowKey = game.input.keyboard.addKey(upKey);
    this.upArrowKey.onDown.add(this.onUpArrowKeyPressed, this);
    this.rightArrowKey = game.input.keyboard.addKey(rightKey);
    this.rightArrowKey.onDown.add(this.onRightArrowKeyPressed, this);
    this.downArrowKey = game.input.keyboard.addKey(downKey);
    this.downArrowKey.onDown.add(this.onDownArrowKeyPressed, this);
    this.leftArrowKey = game.input.keyboard.addKey(leftKey);
    this.leftArrowKey.onDown.add(this.onLeftArrowKeyPressed, this);
}