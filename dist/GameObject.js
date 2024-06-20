import { GameBoard } from "./Board.js";
import { Canvas } from "./Canvas.js";
import { Game } from "./Game.js";
class GameObject {
    _x;
    _y;
    color;
    constructor(_x, _y, color) {
        this._x = _x;
        this._y = _y;
        this.color = color;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(xCoord) {
        console.log(xCoord);
        if (xCoord >= 0 &&
            xCoord <= GameBoard.gridSize * (Game.instance.map.ROWS + 1)) {
            this._x = xCoord;
        }
        else {
            throw new Error("Invalid x-coordinate");
        }
    }
    set y(yCoord) {
        console.log(yCoord);
        if (yCoord >= 0 &&
            yCoord <= GameBoard.gridSize * (Game.instance.map.COLUMNS + 1)) {
            this._y = yCoord;
        }
        else {
            throw new Error("Invalid y-coordinate");
        }
    }
    startDraw() {
        Canvas.instance.context.beginPath();
    }
    endDraw() {
        Canvas.instance.context.closePath();
    }
    draw() {
        this.startDraw();
        this.drawSelf();
        this.endDraw();
    }
}
class RectangularGameObject extends GameObject {
    _width;
    _height;
    firstMove;
    constructor(_x, _y, color, _width, _height, firstMove = null) {
        super(_x, _y, color);
        this._width = _width;
        this._height = _height;
        this.firstMove = firstMove;
        this.firstMove = firstMove;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    drawSelf() {
        Canvas.instance.context.fillStyle = this.color;
        Canvas.instance.context.fillRect(this.x, this.y, this.width, this.height);
    }
}
export { GameObject, RectangularGameObject };
//# sourceMappingURL=GameObject.js.map