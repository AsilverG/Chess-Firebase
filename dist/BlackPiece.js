import { GameBoard } from "./Board.js";
import { MoveBishopCommand, MoveKingCommand, MoveKnightCommand, MovePawnCommand, MoveQueenCommand, MoveRookCommand, } from "./Command.js";
import { Game } from "./Game.js";
import ChessPiece from "./ChessPiece.js";
class BlackPiece extends ChessPiece {
    constructor(x, y, firstMove) {
        super(x, y, "black", GameBoard.gridSize, GameBoard.gridSize, firstMove);
        this._isPieceBlack = true;
    }
}
class BlackPawn extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_Pawn.png`;
        this.movementCommand = new MovePawnCommand(!Game.instance.map.isPlayerBlack);
        this.pieceType = "p";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class BlackKing extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_King.png`;
        this.movementCommand = new MoveKingCommand();
        this.pieceType = "k";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class BlackQueen extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_Queen.png`;
        this.movementCommand = new MoveQueenCommand();
        this.pieceType = "q";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class BlackKnight extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_Knight.png`;
        this.movementCommand = new MoveKnightCommand();
        this.pieceType = "n";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class BlackRook extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_Rook.png`;
        this.movementCommand = new MoveRookCommand();
        this.pieceType = "r";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
class BlackBishop extends BlackPiece {
    constructor(x, y, firstMove) {
        super(x, y, firstMove);
        this.img.src = `imgs/Black_Bishop.png`;
        this.movementCommand = new MoveBishopCommand();
        this.pieceType = "b";
    }
    updateSelf() { }
    getLegalMoves() {
        this.movementCommand.execute(this.x, this.y);
        return this.movementCommand.getAllLegalMoves();
    }
}
export { BlackPiece, BlackPawn, BlackBishop, BlackKing, BlackQueen, BlackKnight, BlackRook, };
//# sourceMappingURL=BlackPiece.js.map