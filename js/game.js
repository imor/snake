
var snakeCells = [];
var food;
var initialSnakeLength = 3;
var cellWidth = 10;
var numberOfGameCells = 40;
var gameWidth = numberOfGameCells * cellWidth;
var snakeSpeed = 5;
var game = new Phaser.Game(gameWidth, gameWidth, Phaser.AUTO, 'snake', { preload: preload, create: create, update: update });

var DIRECTION = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var direction = DIRECTION.RIGHT;
var inputBuffer = [];
var inputBufferSize = 2;
var upArrowKey;
var rightArrowKey;
var downArrowKey;
var leftArrowKey;

function getAdjacentCellPosition(x, y, size, direction) {
    var newX;
    var newY;
    if (direction == DIRECTION.UP) {
        newY = y - size;
        if (newY < 0) {
            newY = newY + gameWidth;
        }
        return {x:x, y:newY};
    } else if (direction == DIRECTION.RIGHT) {
        newX = x + size;
        if (newX >= gameWidth) {
            newX = newX - gameWidth;
        }
        return {x:newX, y:y};
    } else if (direction == DIRECTION.DOWN) {
        newY = y + size;
        if (newY >= gameWidth) {
            newY = newY - gameWidth;
        }
        return {x:x, y:newY};
    } else if (direction == DIRECTION.LEFT) {
        newX = x - size;
        if (newX < 0) {
            newX = newX + gameWidth;
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
    var nextPosition = getAdjacentCellPosition(head.x, head.y, cellWidth, newDirection);
    if (isFoodLocation(nextPosition.x, nextPosition.y)) {
        snakeCells.unshift(game.add.sprite(nextPosition.x, nextPosition.y, 'cell'));
        var foodLocation = createFoodLocation();
        food.x = foodLocation.x;
        food.y = foodLocation.y;
    }

    var last = snakeCells.pop();
    last.x = nextPosition.x;
    last.y = nextPosition.y;
    snakeCells.unshift(last);
    direction = newDirection;
}

function preload() {
    game.load.image('cell', 'images/cell.png');
}

function create() {
    game.stage.backgroundColor = '#ffffff';
    
    for (var i = initialSnakeLength - 1;i >= 0;--i) {
        snakeCells.push(game.add.sprite(i * cellWidth, 0, 'cell'));
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
}

function update() {
}

function createFoodLocation() {
    var x = game.rnd.integerInRange(0, numberOfGameCells - 1) * cellWidth;
    var y = game.rnd.integerInRange(0, numberOfGameCells - 1) * cellWidth;
    while (isInsideSnake(x, y)) {
        x = game.rnd.integerInRange(0, numberOfGameCells - 1) * cellWidth;
        y = game.rnd.integerInRange(0, numberOfGameCells - 1) * cellWidth;
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
    if (newDirection && inputBuffer.length < inputBufferSize) {
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
    if (newDirection && inputBuffer.length < inputBufferSize) {
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
    if (newDirection && inputBuffer.length < inputBufferSize) {
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
    if (newDirection && inputBuffer.length < inputBufferSize) {
        inputBuffer.push(newDirection);
    }
}
