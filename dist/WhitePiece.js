import ChessPiece from "./ChessPiece.js";
import { GameBoard } from "./Board.js";
import { MoveBishopCommand, MoveKingCommand, MoveKnightCommand, MovePawnCommand, MoveQueenCommand, MoveRookCommand, } from "./Command.js";
import { Game } from "./Game.js";
class WhitePiece extends ChessPiece {
    constructor(x, y, firstMove) {
        super(x, y, "black", GameBoard.gridSize, GameBoard.gridSize, firstMove);
        this._isPieceBlack = false;
    }
}
class WhitePawn extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_Pawn.png`;
        this.movementCommand = new MovePawnCommand(Game.instance.map.isPlayerBlack);
        this.pieceType = "P";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class WhiteKing extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_King.png`;
        this.movementCommand = new MoveKingCommand();
        this.pieceType = "K";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class WhiteQueen extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_Queen.png`;
        this.movementCommand = new MoveQueenCommand();
        this.pieceType = "Q";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class WhiteKnight extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_Knight.png`;
        this.movementCommand = new MoveKnightCommand();
        this.pieceType = "N";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class WhiteRook extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_Rook.png`;
        this.movementCommand = new MoveRookCommand();
        this.pieceType = "R";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class WhiteBishop extends WhitePiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/White_Bishop.png`;
        this.movementCommand = new MoveBishopCommand();
        this.pieceType = "B";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
export { WhitePiece, WhitePawn, WhiteKing, WhiteKnight, WhiteRook, WhiteBishop, WhiteQueen, };
//# sourceMappingURL=WhitePiece.js.map