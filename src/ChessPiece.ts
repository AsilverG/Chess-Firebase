import { RectangularGameObject } from "./GameObject.js";
import { Pieces } from "./Board.js";
import { Canvas } from "./Canvas.js";
abstract class ChessPiece extends RectangularGameObject {
  
  protected img = new Image();
  //@ts-ignore
  public movementCommand: MovePieceCommand;
  //@ts-ignore
  protected _pieceType: string;
  //@ts-ignore
  protected _isPieceBlack: boolean;

  public get isPieceBlack(): boolean {
    return this._isPieceBlack;
  }

  abstract updateSelf(): void;
  // abstract getLegalMoves(): number[][];

  public firstMove: boolean = true;
  public enPassantAvailable: boolean = false;

  public drawSelf() {
    if (this.img.complete) {
      this.drawImage();
    } else {
      this.img.onload = () => {
        this.drawImage();
      };
    }
  }

  private drawImage() {
    Canvas.instance.context.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  public checkTileLocation(x: number, y: number): boolean {
    return (
      this._x <= x &&
      this._x + this._width > x &&
      this._y <= y &&
      this._y + this._height > y
    );
  }

  public get pieceType(): string {
    return this._pieceType;
  }

  protected set pieceType(piece: string) {
    if (Object.values(Pieces).includes(piece.toLowerCase() as Pieces)) {
      this._pieceType = piece;
    } else {
      this._pieceType = Pieces.EMPTY;
    }
  }

  abstract getLegalMoves(): number[][];

  public toObject() {
    console.log(this.firstMove)
    return {
      x: this.x,
      y: this.y,
      pieceType: this.pieceType,
      firstMove: this.firstMove,
    };
  }  
}

export default ChessPiece;
