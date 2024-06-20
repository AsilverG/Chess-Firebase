import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackPiece,
  BlackQueen,
  BlackRook,
} from "./BlackPiece.js";
import { Pieces } from "./Board.js";
import {
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhitePiece,
  WhiteQueen,
  WhiteRook,
} from "./WhitePiece.js";

class BlackPieceFactory {
  public static make(type: Pieces, x: number, y: number, firstMove: boolean): BlackPiece {
    // console.log(`Creating Black Piece: ${type}, x: ${x}, y: ${y}`);
    switch (type) {
      case Pieces.BISHOP:
        return new BlackBishop(x, y, firstMove);
      case Pieces.KING:
        return new BlackKing(x, y, firstMove);
      case Pieces.KNIGHT:
        return new BlackKnight(x, y, firstMove);
      case Pieces.PAWN:
        return new BlackPawn(x, y, firstMove);
      case Pieces.QUEEN:
        return new BlackQueen(x, y, firstMove);
      case Pieces.ROOK:
        return new BlackRook(x, y, firstMove);
      default:
        throw new Error("unknown piece");
    }
  }
}

class WhitePieceFactory {
  public static make(type: Pieces, x: number, y: number, firstMove: boolean): WhitePiece {
    // console.log(`Creating White Piece: ${type}, x: ${x}, y: ${y}`);
    switch (type.toLowerCase()) {
      case Pieces.BISHOP:
        return new WhiteBishop(x, y, firstMove);
      case Pieces.KING:
        return new WhiteKing(x, y, firstMove);
      case Pieces.KNIGHT:
        return new WhiteKnight(x, y, firstMove);
      case Pieces.PAWN:
        return new WhitePawn(x, y, firstMove);
      case Pieces.QUEEN:
        return new WhiteQueen(x, y, firstMove);
      case Pieces.ROOK:
        return new WhiteRook(x, y, firstMove);
      default:
        throw new Error("unknown piece");
    }
  }
}
export { BlackPieceFactory, WhitePieceFactory };
