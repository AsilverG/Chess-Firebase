import { GameBoard } from "./Board.js";
import { Canvas } from "./Canvas.js";
import { RectangularGameObject } from "./GameObject.js";


class BaseTile extends RectangularGameObject {
  constructor(
    x: number,
    y: number,
    color: string,
    readonly size: number = GameBoard.gridSize
  ) {
    super(x, y, color, size, size);
  }

  public get centerX(): number {
    return this.x + this.size / 2;
  }

  public get centerY(): number {
    return this.y + this.size / 2;
  }

  public tileCoordinates(x: number, y: number): number[] {
    const I: number = Math.floor(x / GameBoard.gridSize);
    const J: number = Math.floor(y / GameBoard.gridSize);

    return [I, J];
  }

  public drawSelf(): void {
    Canvas.instance.context.fillStyle = this.color;
    Canvas.instance.context.fillRect(this.x, this.y, this.width, this.height);
    // Utilities.drawLine(
    //   this.x + 1,
    //   this.y + 1,
    //   this.x + this.size - 2,
    //   this.y + 1
    // );
    // Utilities.drawLine(
    //   this.x + this.size - 2,
    //   this.y + 1,
    //   this.x + this.size - 2,
    //   this.y + this.size - 2
    // );
    // Utilities.drawLine(
    //   this.x + this.size - 2,
    //   this.y + this.size - 2,
    //   this.x + 1,
    //   this.y + this.size - 2
    // );
    // Utilities.drawLine(
    //   this.x + 1,
    //   this.y + this.size - 2,
    //   this.x + 1,
    //   this.y + 1
    // );
  }

  public static isTileValid(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x < 8 * GameBoard.gridSize &&
      y >= 0 &&
      y < 8 * GameBoard.gridSize
    );
  }

  // public static isTileEmpty(tile: BaseTile): boolean {
  //   return tile instanceof EmptyTile;
  // }

  public static getTile(
    numeratedMap: BaseTile[][],
    x: number,
    y: number
  ): BaseTile {
    const col = x / GameBoard.gridSize;
    const row = y / GameBoard.gridSize;
    return numeratedMap[row][col];
  }
}

// class EmptyTile extends BaseTile {
//   constructor(x: number, y: number, color: string) {
//     super(x, y, color);
//     this.state = TileTypes.EMPTY;
//   }

//   public get type(): string {
//     return this.state;
//   }
// }

// class BlackTile extends BaseTile {
//   constructor(x: number, y: number, color: string) {
//     super(x, y, color);
//     this.state = TileTypes.BLACK;
//   }

//   public get type(): string {
//     return this.state;
//   }
// }

// class WhiteTile extends BaseTile {
//   constructor(x: number, y: number, color: string) {
//     super(x, y, color);
//     this.state = TileTypes.WHITE;
//   }

//   public get type(): string {
//     return this.state;
//   }
// }
export default BaseTile;
