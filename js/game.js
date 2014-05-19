
var snakeCells = [];
var initialSnakeLength = 3;
var cellWidth = 10;
var numberOfsnakeCells = 40;
var gameWidth = numberOfsnakeCells * cellWidth;
var snakeSpeed = 0.5;
var game = new Phaser.Game(gameWidth, gameWidth, Phaser.AUTO, 'snake', { preload: preload, create: create, update: update });

var DIRECTION = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var direction = DIRECTION.RIGHT;
var arrowKeys;

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
    var last = snakeCells.pop();
    var nextPosition = getAdjacentCellPosition(head.x, head.y, cellWidth, direction);
    last.x = nextPosition.x;
    last.y = nextPosition.y;
    snakeCells.unshift(last);
}

function preload() {
    game.load.image('cell', 'images/cell.png');
}

function create() {
    game.stage.backgroundColor = '#ffffff';
    
    for (var i = initialSnakeLength - 1;i >= 0;--i) {
        snakeCells.push(game.add.sprite(i * cellWidth, 0, 'cell'));
    }
    
    game.time.events.loop(Phaser.Timer.SECOND * snakeSpeed, moveSnake, this);
    arrowKeys = game.input.keyboard.createCursorKeys();
}

function update() {
    if (arrowKeys.right.isDown && direction != DIRECTION.LEFT) {
        direction = DIRECTION.RIGHT;
    } else if (arrowKeys.left.isDown && direction != DIRECTION.RIGHT) {
        direction = DIRECTION.LEFT;
    } else if (arrowKeys.up.isDown && direction != DIRECTION.DOWN) {
        direction = DIRECTION.UP;
    } else if (arrowKeys.down.isDown && direction != DIRECTION.UP) {
        direction = DIRECTION.DOWN;
    }
}