import { GameBoard } from "./Board.js";
import { Canvas } from "./Canvas.js";
import { Game } from "./Game.js";

abstract class GameObject {
  constructor(
    protected _x: number,
    protected _y: number,
    protected color: string
  ) {}

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public set x(xCoord: number) {
    console.log(xCoord);
    if (
      xCoord >= 0 &&
      xCoord <= GameBoard.gridSize * (Game.instance.map.ROWS + 1)
    ) {
      this._x = xCoord;
    } else {
      throw new Error("Invalid x-coordinate");
    }
  }

  public set y(yCoord: number) {
    console.log(yCoord);

    if (
      yCoord >= 0 &&
      yCoord <= GameBoard.gridSize * (Game.instance.map.COLUMNS + 1)
    ) {
      this._y = yCoord;
    } else {
      throw new Error("Invalid y-coordinate");
    }
  }

  protected startDraw(): void {
    Canvas.instance.context.beginPath();
  }

  protected endDraw(): void {
    Canvas.instance.context.closePath();
  }

  abstract drawSelf(): void;

  public draw() {
    this.startDraw();
    this.drawSelf();
    this.endDraw();
  }
}

abstract class RectangularGameObject extends GameObject {
  constructor(
    _x: number,
    _y: number,
    color: string,
    protected _width: number,
    protected _height: number,
    protected firstMove: boolean | null = null
  ) {
    super(_x, _y, color);
    this.firstMove = firstMove;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public drawSelf() {
    Canvas.instance.context.fillStyle = this.color;
    Canvas.instance.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export { GameObject, RectangularGameObject };
