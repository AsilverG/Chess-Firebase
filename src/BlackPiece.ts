import { GameBoard, Pieces } from "./Board.js";
import { Canvas } from "./Canvas.js";
import {
  MoveBishopCommand,
  MoveKingCommand,
  MoveKnightCommand,
  MovePawnCommand,
  MovePieceCommand,
  MoveQueenCommand,
  MoveRookCommand,
} from "./Command.js";
import {Game} from "./Game.js";
import { RectangularGameObject } from "./GameObject.js";
import ChessPiece from "./ChessPiece.js";

abstract class BlackPiece extends ChessPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, "black", GameBoard.gridSize, GameBoard.gridSize, firstMove);
    this._isPieceBlack = true;
  }


}

class BlackPawn extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_Pawn.png`;
    this.movementCommand = new MovePawnCommand(
      !Game.instance.map.isPlayerBlack,
    );
    this.pieceType = "p";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

class BlackKing extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_King.png`;
    this.movementCommand = new MoveKingCommand();
    this.pieceType = "k";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

class BlackQueen extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_Queen.png`;
    this.movementCommand = new MoveQueenCommand();
    this.pieceType = "q";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

class BlackKnight extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_Knight.png`;
    this.movementCommand = new MoveKnightCommand();
    this.pieceType = "n";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

class BlackRook extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_Rook.png`;
    this.movementCommand = new MoveRookCommand();
    this.pieceType = "r";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

class BlackBishop extends BlackPiece {
  constructor(x: number, y: number, firstMove: boolean) {
    super(x, y, firstMove);
    this.img.src = `imgs/Black_Bishop.png`;
    this.movementCommand = new MoveBishopCommand();
    this.pieceType = "b";
  }

  public updateSelf(): void {}

  public getLegalMoves(): number[][] {
    this.movementCommand.execute(this.x, this.y);
    return this.movementCommand.getAllLegalMoves();
  }
}

export {
  BlackPiece,
  BlackPawn,
  BlackBishop,
  BlackKing,
  BlackQueen,
  BlackKnight,
  BlackRook,
};
