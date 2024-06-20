import { GameBoard } from "./Board.js";
import { Canvas } from "./Canvas.js";
import { RectangularGameObject } from "./GameObject.js";
class BaseTile extends RectangularGameObject {
    size;
    constructor(x, y, color, size = GameBoard.gridSize) {
        super(x, y, color, size, size);
        this.size = size;
    }
    get centerX() {
        return this.x + this.size / 2;
    }
    get centerY() {
        return this.y + this.size / 2;
    }
    tileCoordinates(x, y) {
        const I = Math.floor(x / GameBoard.gridSize);
        const J = Math.floor(y / GameBoard.gridSize);
        return [I, J];
    }
    drawSelf() {
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
    static isTileValid(x, y) {
        return (x >= 0 &&
            x < 8 * GameBoard.gridSize &&
            y >= 0 &&
            y < 8 * GameBoard.gridSize);
    }
    // public static isTileEmpty(tile: BaseTile): boolean {
    //   return tile instanceof EmptyTile;
    // }
    static getTile(numeratedMap, x, y) {
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
//# sourceMappingURL=Tile.js.map