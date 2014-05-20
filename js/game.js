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
        snake.kill();
    });
    food.kill();
    init();
}

var game = new Phaser.Game(GAME_WIDTH, GAME_WIDTH, Phaser.AUTO, 'snake');
var player1Style;
var player2Style;
var p1Text;
var p2Text;

var main = {
    preload: function() {
        game.load.image('player1Cell', 'images/redCell.png');
        game.load.image('player2Cell', 'images/blueCell.png');
        game.load.image('foodCell', 'images/greenCell.png');
    },

    create: function() {
        game.stage.backgroundColor = '#ffe88a';

        snakes['player1Cell'] = new Snake(Phaser.Keyboard.W, Phaser.Keyboard.D, Phaser.Keyboard.S, Phaser.Keyboard.A, 20, 0, DIRECTION.RIGHT, 'player1Cell');
        snakes['player2'] = new Snake(Phaser.Keyboard.UP, Phaser.Keyboard.RIGHT, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, 370, 390, DIRECTION.LEFT, 'player2Cell');
        var foodLocation = createFoodLocation();
        food = game.add.sprite(foodLocation.x, foodLocation.y, 'foodCell');

        player1Style = { font: "15px Arial", fill: "#ff0044", align: "center" };
        player2Style = { font: "15px Arial", fill: "#4400ff", align: "center" };
        p1Text = game.add.text(10, 10, "" + player1Score, player1Style);
        p2Text = game.add.text(370, 10, "" + player2Score, player2Style);
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
