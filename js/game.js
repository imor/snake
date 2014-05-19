var INITIAL_SNAKE_LENGTH = 3;
var CELL_WIDTH = 10;
var NUMBER_OF_GAME_CELLS = 40;
var GAME_WIDTH = NUMBER_OF_GAME_CELLS * CELL_WIDTH;
var INPUT_BUFFER_SIZE = 2;

var DIRECTION = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var direction;
var inputBuffer;
var upArrowKey;
var rightArrowKey;
var downArrowKey;
var leftArrowKey;
var snakeCells;
var food;
var snakeSpeed ;

function init() {
    direction = DIRECTION.RIGHT;
    inputBuffer = [];
    snakeCells = [];
    food;
    snakeSpeed = 5;
}

function restart() {
    var length = snakeCells.length;
    for (var i = 0;i < length;i++) {
        snakeCells[i].kill();
    }
    food.kill();
    init();
}

init();

var game = new Phaser.Game(GAME_WIDTH, GAME_WIDTH, Phaser.AUTO, 'snake');

var main = {
    preload: function() {
        game.load.image('cell', 'images/cell.png');
    },

    create: function() {
        game.stage.backgroundColor = '#ffffff';

        for (var i = INITIAL_SNAKE_LENGTH - 1;i >= 0;--i) {
            snakeCells.push(game.add.sprite(i * CELL_WIDTH, 0, 'cell'));
        }
        var foodLocation = createFoodLocation();
        food = game.add.sprite(foodLocation.x, foodLocation.y, 'cell');

        game.time.events.loop(Phaser.Timer.SECOND / snakeSpeed, moveSnake, this);

        upArrowKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upArrowKey.onDown.add(onUpArrowKeyPressed, this);
        rightArrowKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightArrowKey.onDown.add(onRightArrowKeyPressed, this);
        downArrowKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downArrowKey.onDown.add(onDownArrowKeyPressed, this);
        leftArrowKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftArrowKey.onDown.add(onLeftArrowKeyPressed, this);
    },

    update: function() {
    }
};

game.state.add('main', main);
game.state.start('main');

function getAdjacentCellPosition(x, y, size, direction) {
    var newX;
    var newY;
    if (direction == DIRECTION.UP) {
        newY = y - size;
        if (newY < 0) {
            newY = newY + GAME_WIDTH;
        }
        return {x:x, y:newY};
    } else if (direction == DIRECTION.RIGHT) {
        newX = x + size;
        if (newX >= GAME_WIDTH) {
            newX = newX - GAME_WIDTH;
        }
        return {x:newX, y:y};
    } else if (direction == DIRECTION.DOWN) {
        newY = y + size;
        if (newY >= GAME_WIDTH) {
            newY = newY - GAME_WIDTH;
        }
        return {x:x, y:newY};
    } else if (direction == DIRECTION.LEFT) {
        newX = x - size;
        if (newX < 0) {
            newX = newX + GAME_WIDTH;
        }
        return {x:newX, y:y};
    }
}

function moveSnake() {
    var head = snakeCells[0];
    var newDirection = inputBuffer.shift();
    if (!newDirection) {
        newDirection = direction;
    }
    var nextPosition = getAdjacentCellPosition(head.x, head.y, CELL_WIDTH, newDirection);
    if (isFoodLocation(nextPosition.x, nextPosition.y)) {
        snakeCells.unshift(game.add.sprite(nextPosition.x, nextPosition.y, 'cell'));
        var foodLocation = createFoodLocation();
        food.x = foodLocation.x;
        food.y = foodLocation.y;
    } else if (isInsideSnake(nextPosition.x, nextPosition.y)) {
        restart();
        game.state.start('main');
        return;
    }

    var last = snakeCells.pop();
    last.x = nextPosition.x;
    last.y = nextPosition.y;
    snakeCells.unshift(last);
    direction = newDirection;
}

function createFoodLocation() {
    var x = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    var y = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    while (isInsideSnake(x, y)) {
        x = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
        y = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    }

    return {x:x, y:y};
}

function isInsideSnake(x, y) {
    var length = snakeCells.length;
    for (var i = 0;i < length;i++) {
        var cell = snakeCells[i];
        if (cell.x === x && cell.y === y) {
            return true;
        }
    }
    return false;
}

function isFoodLocation(x, y) {
    if (food && food.x === x && food.y === y) {
        return true;
    }
    return false;
}

function onUpArrowKeyPressed() {
    var newDirection;
    var oldDirection = direction;
    if (inputBuffer.length > 0) {
        oldDirection = inputBuffer[inputBuffer.length - 1];
    }
    if (oldDirection != DIRECTION.DOWN) {
        newDirection = DIRECTION.UP;
    }
    if (newDirection && inputBuffer.length < INPUT_BUFFER_SIZE) {
        inputBuffer.push(newDirection);
    }
}

function onRightArrowKeyPressed() {
    var newDirection;
    var oldDirection = direction;
    if (inputBuffer.length > 0) {
        oldDirection = inputBuffer[inputBuffer.length - 1];
    }
    if (oldDirection != DIRECTION.LEFT) {
        newDirection = DIRECTION.RIGHT;
    }
    if (newDirection && inputBuffer.length < INPUT_BUFFER_SIZE) {
        inputBuffer.push(newDirection);
    }
}

function onDownArrowKeyPressed() {
    var newDirection;
    var oldDirection = direction;
    if (inputBuffer.length > 0) {
        oldDirection = inputBuffer[inputBuffer.length - 1];
    }
    if (oldDirection != DIRECTION.UP) {
        newDirection = DIRECTION.DOWN;
    }
    if (newDirection && inputBuffer.length < INPUT_BUFFER_SIZE) {
        inputBuffer.push(newDirection);
    }
}

function onLeftArrowKeyPressed() {
    var newDirection;
    var oldDirection = direction;
    if (inputBuffer.length > 0) {
        oldDirection = inputBuffer[inputBuffer.length - 1];
    }
    if (oldDirection != DIRECTION.RIGHT) {
        newDirection = DIRECTION.LEFT;
    }
    if (newDirection && inputBuffer.length < INPUT_BUFFER_SIZE) {
        inputBuffer.push(newDirection);
    }
}
