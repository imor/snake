function drawCell(position, side, cellColor, borderColor, borderWidth) {
    cellColor = cellColor || 0xd4d4d4;
    borderColor = borderColor || 0xd4d4d4;
    borderWidth = borderWidth || 1;

    graphics.beginFill(cellColor);
    graphics.lineStyle(borderWidth, borderColor);

    var x = position.getX();
    var y = position.getY();
    // draw a shape
    graphics.moveTo(x, y);
    graphics.lineTo(x + side, y);
    graphics.lineTo(x + side, y + side);
    graphics.lineTo(x, y + side);
    graphics.lineTo(x, y);
    graphics.endFill();
}
