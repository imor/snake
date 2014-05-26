'use strict';
var CELL_WIDTH = 10;
var NUMBER_OF_GAME_CELLS = 40;
var GAME_WIDTH = NUMBER_OF_GAME_CELLS * CELL_WIDTH;
var player1Score = 0;
var player2Score = 0;

var DIRECTION = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var snakes;
var food;

function init() {
    snakes = {};
    game.state.start('main');
}

function restart() {
    Object.keys(snakes).forEach(function(key) {
        var snake = snakes[key];
        snake.destroy();
    });
    food.destroy();
    init();
}

var game = new Phaser.Game(GAME_WIDTH, GAME_WIDTH, Phaser.AUTO, 'game');
var player1Style;
var player2Style;
var player1ScoreText;
var player2ScoreText;

var main = {
    preload: function() {
        game.load.image('player1Cell', 'images/redCell.png');
        game.load.image('player2Cell', 'images/blueCell.png');
        game.load.image('foodCell', 'images/greenCell.png');
    },

    create: function() {
        game.stage.backgroundColor = '#ffe88a';

        //snakes['player1'] = new Snake(20, 0, DIRECTION.RIGHT, 'player1Cell', Phaser.Keyboard.W, Phaser.Keyboard.D, Phaser.Keyboard.S, Phaser.Keyboard.A);
        snakes.player1 = new Snake(20, 0, DIRECTION.RIGHT, 'player1Cell');
        snakes.player2 = new Snake(370, 390, DIRECTION.LEFT, 'player2Cell', Phaser.Keyboard.UP, Phaser.Keyboard.RIGHT, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT);
        //snakes['player2'] = new Snake(370, 390, DIRECTION.LEFT, 'player2Cell');
        var foodLocation = createFoodLocation();
        food = game.add.sprite(foodLocation.x, foodLocation.y, 'foodCell');

        player1Style = { font: "15px Arial", fill: "#ff0044", align: "center" };
        player2Style = { font: "15px Arial", fill: "#4400ff", align: "center" };
        player1ScoreText = game.add.text(10, 10, "" + player1Score, player1Style);
        player2ScoreText = game.add.text(370, 10, "" + player2Score, player2Style);
    },

    update: function() {
    }
};

game.state.add('main', main);
init();

function createFoodLocation() {
    var x = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    var y = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    while (isSnakeLocation(x, y)) {
        x = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
        y = game.rnd.integerInRange(0, NUMBER_OF_GAME_CELLS - 1) * CELL_WIDTH;
    }

    return {x:x, y:y};
}

function isFoodLocation(x, y) {
    if (food && food.x === x && food.y === y) {
        return true;
    }
    return false;
}

function isSnakeLocation(x, y) {
    var result = false;
    Object.keys(snakes).forEach(function(key) {
        var snake = snakes[key];
        if (snake.isSnakeLocation(x, y)) {
            result = true;
        }
    });
    return result;
}

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

function getOppositeDirection(direction) {
    if (direction === DIRECTION.UP) {
        return DIRECTION.DOWN;
    } else if (direction === DIRECTION.RIGHT) {
        return DIRECTION.LEFT;
    } else if (direction === DIRECTION.DOWN) {
        return DIRECTION.UP;
    } else if (direction === DIRECTION.LEFT) {
        return DIRECTION.RIGHT;
    }
}

function getDirectionFromTwoPositions(fromX, fromY, toX, toY) {
    if (toX > fromX && toY === fromY) {
        return DIRECTION.RIGHT;
    } else if (toX < fromX && toY === fromY) {
        return DIRECTION.LEFT;
    } else if (toY > fromY && toX === fromX) {
        return DIRECTION.DOWN;
    } else if (toY < fromY && toX === fromX) {
        return DIRECTION.UP;
    }
    return -1;
}

function snakeAteFood(snake) {
    if (snake.spriteKey === 'player1Cell') {
        player1Score += 1;
        player1ScoreText.destroy();
        player1ScoreText = game.add.text(10, 10, "" + player1Score, player1Style);
    } else {
        player2Score += 1;
        player2ScoreText.destroy();
        player2ScoreText = game.add.text(370, 10, "" + player2Score, player2Style);
    }
}

function snakeDied(snake) {
    snake.destroy();
    if (snake.spriteKey === 'player1Cell') {
        player2Score += 3;
        player2ScoreText.destroy();
        player2ScoreText = game.add.text(370, 10, "" + player2Score, player2Style);
        //player2's timer is restarted because when a new snake is created its timer will get a little out
        //of sync with the other snake. So we restart the other player's timer as well to sync them up.
        snakes.player1 = new Snake(20, 0, DIRECTION.RIGHT, 'player1Cell');
        snakes.player2.restartTimer();
    } else {
        player1Score += 3;
        player1ScoreText.destroy();
        player1ScoreText = game.add.text(10, 10, "" + player1Score, player1Style);
        snakes.player2 = new Snake(370, 390, DIRECTION.LEFT, 'player2Cell', Phaser.Keyboard.UP, Phaser.Keyboard.RIGHT, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT);
        snakes.player1.restartTimer();
    }
}
