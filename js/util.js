function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPoint() {
    return new Point(generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE, generateRandomInt(0, (NUMBER_OF_CELLS - 1)) * CELL_SIZE);
}
