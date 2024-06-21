import { GameBoard, Pieces } from "./Board.js";
import { Canvas } from "./Canvas.js";
import { Game } from "./Game.js";
//@ts-ignore Import module 
import { update, ref, onValue
//@ts-ignore Import module
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { FirebaseClient } from "./firebaseclient.js";
class HandleMouseClickCommand {
    mousePositionX = 0;
    mousePositionY = 0;
    /**
   * Assigns coordinates to the command.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @returns {Command} - The command with assigned coordinates.
   */
    assignCoordinates(x, y) {
        this.mousePositionX = x;
        this.mousePositionY = y;
        return this;
    }
}
class MovePieceCommand {
    //@ts-ignore
    pieceType;
    //@ts-ignore
    isMyPieceBlack;
    //@ts-ignore
    movementDirections;
    //@ts-ignore
    tempGameMap;
    //@ts-ignore
    coordinate;
    isOpponentKingInCheck = false;
    legalMovesCoordinates = [];
    //@ts-ignore
    fromTile;
    //@ts-ignore
    x;
    //@ts-ignore
    y;
    constructor() { }
    execute(x, y) {
        //default: check 7 tiles for each direction
        this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    }
    /**
   * Checks possible movements for the piece.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {number} amounts - The number of possible moves.
   */
    checkPossibleMovements(x, y, amounts) {
        this.getStartingCoordinatesAndTile(x, y);
        this.getLegalMoves(amounts);
        this.fillColors();
    }
    fillColors() {
        Canvas.instance.context.globalAlpha = 0.5;
        for (let i = 0; i < this.legalMovesCoordinates.length; i++) {
            Canvas.instance.context.beginPath();
            Canvas.instance.context.fillStyle = "red";
            Canvas.instance.context.arc(this.legalMovesCoordinates[i][0] * GameBoard.gridSize +
                GameBoard.gridSize / 2, this.legalMovesCoordinates[i][1] * GameBoard.gridSize +
                GameBoard.gridSize / 2, GameBoard.gridSize / 4, 0, 2 * Math.PI);
            Canvas.instance.context.fill();
            Canvas.instance.context.closePath();
        }
        Canvas.instance.context.globalAlpha = 1;
    }
    checkCastling(d, x, y) {
        return 1 !== 1;
    }
    /**
   * Gets the starting coordinates and tile for the move.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
    getStartingCoordinatesAndTile(x, y) {
        this.x = Math.floor(x / GameBoard.gridSize);
        this.y = Math.floor(y / GameBoard.gridSize);
        this.fromTile = Game.instance.map.tileMap[this.y][this.x];
        this.coordinate = this.fromTile.tileCoordinates(x, y);
    }
    getLegalMoves(amounts) {
        this.legalMovesCoordinates = [];
        this.x = this.coordinate[0];
        this.y = this.coordinate[1];
        this.pieceType = Game.instance.map.gameMap[this.y][this.x];
        // get piece letter
        const TILE_TYPE = Game.instance.map.gameMap[this.y][this.x];
        //check the color of the piece by comparing with its lower case
        this.isMyPieceBlack = TILE_TYPE === TILE_TYPE.toLowerCase();
        for (let n = 0; n < this.movementDirections.length; n++) {
            for (let i = 0; i < amounts; i++) {
                const NEW_X = this.x + (i + 1) * this.movementDirections[n][0];
                const NEW_Y = this.y + (i + 1) * this.movementDirections[n][1];
                if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0)
                    break;
                //castling
                if (
                //if king can move 2 tiles, its castling
                Math.abs(this.movementDirections[n][0]) === 2 &&
                    TILE_TYPE.toLowerCase() === Pieces.KING) {
                    if (this.checkCastling(this.movementDirections[n][0], this.x, this.y))
                        this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
                }
                else if (this.canMove(NEW_X, NEW_Y)) {
                    //make sure your king is not in check after move or cannot go to the same tile as your other piece
                    this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
                }
                if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY)
                    break;
            }
        }
        Game.instance.playerControl.possibleTiles = this.legalMovesCoordinates;
    }
    canMove(x, y) {
        if (Game.instance.map.gameMap[y][x] !== Pieces.EMPTY &&
            (Game.instance.map.gameMap[y][x] ===
                Game.instance.map.gameMap[y][x].toLowerCase()) ===
                this.isMyPieceBlack) {
            return false;
        }
        if (this.isMyKingInCheck(x, y))
            return false;
        return true;
    }
    isMyKingInCheck(x, y) {
        this.copyBoard();
        // Simulate move by emptying current position
        this.tempGameMap[this.y][this.x] = Pieces.EMPTY;
        this.tempGameMap[y][x] = this.pieceType;
        // Place piece on new position
        const kingPosition = this.findKingPosition();
        return this.isSquareAttacked(kingPosition[1], kingPosition[0]);
    }
    /**
     * copy the game map to silmulate the checks and legal moves
     */
    copyBoard() {
        this.tempGameMap = [];
        for (let r = 0; r < Game.instance.map.ROWS; r++) {
            // Initialize each row as an empty array
            this.tempGameMap[r] = [];
            for (let c = 0; c < Game.instance.map.COLUMNS; c++) {
                this.tempGameMap[r][c] = Game.instance.map.gameMap[r][c];
            }
        }
    }
    findKingPosition() {
        let isMyKingBlack;
        for (let r = 0; r < this.tempGameMap.length; r++) {
            for (let c = 0; c < this.tempGameMap[r].length; c++) {
                const PIECE = this.tempGameMap[r][c];
                if (PIECE.toLowerCase() === Pieces.KING) {
                    isMyKingBlack = PIECE === PIECE.toLowerCase();
                    if (isMyKingBlack && this.isMyPieceBlack) {
                        return [r, c];
                    }
                    else if (!isMyKingBlack && !this.isMyPieceBlack) {
                        return [r, c];
                    }
                }
            }
        }
        throw new Error("No King");
    }
    /**
    * Checks if a square is attacked by an opponent's piece.
    * @param {number} x - The x-coordinate.
    * @param {number} y - The y-coordinate.
    * @returns {boolean} - True if the square is attacked, false otherwise.
    */
    isSquareAttacked(x, y) {
        let check = false;
        const DIAGONAL_ATTACKS = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
        ];
        const DIAGONAL_ATTACKERS = [Pieces.BISHOP, Pieces.QUEEN];
        const STRAIGHT_ATTACKS = [
            [1, 0],
            [-1, 0],
            [0, -1],
            [0, 1],
        ];
        const STRAIGHT_ATTACKERS = [Pieces.ROOK, Pieces.QUEEN];
        const KNIGHT_ATTACKS = [
            [2, -1],
            [2, 1],
            [1, 2],
            [1, -2],
            [-2, 1],
            [-2, -1],
            [-1, 2],
            [-1, -2],
        ];
        // checking for diagonal attacks
        for (let n = 0; n < DIAGONAL_ATTACKS.length; n++) {
            for (let i = 0; i < 7; i++) {
                const CHECK_X = x + (i + 1) * DIAGONAL_ATTACKS[n][0];
                const CHECK_Y = y + (i + 1) * DIAGONAL_ATTACKS[n][1];
                if (CHECK_X > 7 || CHECK_Y > 7 || CHECK_Y < 0 || CHECK_X < 0)
                    break;
                const PIECE = this.tempGameMap[CHECK_Y][CHECK_X];
                if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
                    if (PIECE.toLowerCase() === Pieces.KING && i === 0) {
                        check = true;
                        return check;
                    }
                    if (PIECE.toLowerCase() === Pieces.PAWN && i === 0) {
                        let isPawnBlack;
                        isPawnBlack = PIECE === PIECE.toLowerCase();
                        if (isPawnBlack === Game.instance.map.isPlayerBlack) {
                            if (DIAGONAL_ATTACKS[n][1] === 1) {
                                check = true;
                                return check;
                            }
                        }
                        else if (isPawnBlack !== Game.instance.map.isPlayerBlack) {
                            if (DIAGONAL_ATTACKS[n][1] === -1) {
                                check = true;
                                return check;
                            }
                        }
                    }
                    if (DIAGONAL_ATTACKERS.includes(PIECE.toLowerCase())) {
                        check = true;
                        return check;
                    }
                }
                if (PIECE !== Pieces.EMPTY)
                    break;
            }
        }
        // checking for horizontal and vertical attacks
        for (let n = 0; n < STRAIGHT_ATTACKS.length; n++) {
            for (let i = 0; i < 7; i++) {
                const CHECK_X = x + (i + 1) * STRAIGHT_ATTACKS[n][0];
                const CHECK_Y = y + (i + 1) * STRAIGHT_ATTACKS[n][1];
                if (CHECK_X > 7 || CHECK_Y > 7 || CHECK_Y < 0 || CHECK_X < 0)
                    break;
                const PIECE = this.tempGameMap[CHECK_Y][CHECK_X];
                if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
                    if (PIECE.toLowerCase() === Pieces.KING && i === 0) {
                        check = true;
                        return check;
                    }
                    if (STRAIGHT_ATTACKERS.includes(PIECE.toLowerCase())) {
                        check = true;
                        return check;
                    }
                }
                if (PIECE !== Pieces.EMPTY)
                    break;
            }
        }
        // check for knights
        for (let i = 0; i < KNIGHT_ATTACKS.length; i++) {
            const CHECK_X = x + KNIGHT_ATTACKS[i][0];
            const CHECK_Y = y + KNIGHT_ATTACKS[i][1];
            if (CHECK_X <= 7 && CHECK_Y <= 7 && CHECK_Y >= 0 && CHECK_X >= 0) {
                const PIECE = this.tempGameMap[CHECK_Y][CHECK_X];
                if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
                    if (PIECE.toLowerCase() === Pieces.KNIGHT) {
                        check = true;
                        return check;
                    }
                }
            }
        }
        // console.log(`RETURNNING        ${check}`);
        return check;
    }
    isGameOver(forBlack) {
        let legalMoves = false;
        if (forBlack) {
            for (let i = 0; i < Game.instance.blackPiecesOnTheBoard.length; i++) {
                if (Game.instance.blackPiecesOnTheBoard[i].getLegalMoves().length > 0) {
                    legalMoves = true;
                    return legalMoves;
                }
            }
        }
        else {
            for (let i = 0; i < Game.instance.whitePiecesOnTheBoard.length; i++) {
                if (Game.instance.whitePiecesOnTheBoard[i].getLegalMoves().length > 0) {
                    legalMoves = true;
                    return legalMoves;
                }
            }
        }
        alert("Game Over");
        this.copyBoard();
        this.isMyPieceBlack = !this.isMyPieceBlack;
        const kingPosition = this.findKingPosition();
        if (this.isSquareAttacked(kingPosition[1], kingPosition[0])) {
            console.log("Checkmate");
            alert("Checkmate");
        }
        else {
            console.log("Stalemate");
            alert("Stalemate");
        }
        return legalMoves;
    }
}
class MoveBishopCommand extends MovePieceCommand {
    movementDirections = [
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
    ];
    execute(x, y) {
        this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
class MoveRookCommand extends MovePieceCommand {
    movementDirections = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    execute(x, y) {
        this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
class MoveQueenCommand extends MovePieceCommand {
    movementDirections = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
    ];
    execute(x, y) {
        this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
class MoveKnightCommand extends MovePieceCommand {
    movementDirections = [
        [2, 1],
        [2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
        [-2, 1],
        [-2, -1],
    ];
    execute(x, y) {
        this.checkPossibleMovements(x, y, 1);
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
class MoveKingCommand extends MovePieceCommand {
    movementDirections = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
        [-2, 0],
        [2, 0],
    ];
    execute(x, y) {
        this.checkPossibleMovements(x, y, 1);
    }
    checkCastling(d, x, y) {
        this.copyBoard();
        if (this.isSquareAttacked(x, y))
            return false;
        let kingPiece = Game.instance.playerControl.choosePiece(x * GameBoard.gridSize, y * GameBoard.gridSize);
        if (kingPiece.firstMove !== true)
            return false;
        let isQueenSideCastling;
        if (d > 0 && Game.instance.map.isPlayerBlack) {
            isQueenSideCastling = true;
        }
        else {
            isQueenSideCastling = false;
        }
        if (isQueenSideCastling)
            return this.queenSideCastling(x, y);
        return this.kingSideCastling(x, y);
    }
    kingSideCastling(x, y) {
        return false;
    }
    queenSideCastling(x, y) {
        let checkTiles;
        if (Game.instance.map.isPlayerBlack) {
            checkTiles = 1;
        }
        else {
            checkTiles = -1;
        }
        let rookPiece = Game.instance.playerControl.choosePiece((x + 4 * checkTiles) * GameBoard.gridSize, y * GameBoard.gridSize);
        if (rookPiece.pieceType.toLowerCase() !== Pieces.ROOK)
            return false;
        if (rookPiece.firstMove !== true)
            return false;
        //0,-1,-2,-3
        for (let i = checkTiles; Math.abs(i) < 3; i = i + checkTiles) {
            console.log(y, x + i);
            console.log(Game.instance.map.gameMap[y][x + i]);
            if (Game.instance.map.gameMap[y][x + i] !== Pieces.EMPTY)
                return false;
            this.copyBoard();
            console.log(this.isSquareAttacked(y, x + i));
            if (this.isSquareAttacked(y, x + i))
                return false;
        }
        return true;
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
// Allowing pawn to move 
class MovePawnCommand extends MovePieceCommand {
    moveDownward;
    constructor(moveDownward) {
        super();
        this.moveDownward = moveDownward;
    }
    //@ts-ignore
    captureDiagonally;
    firstMove = true;
    checkPossiblePawnMoves(y) {
        console.log(y);
        if (y !== GameBoard.gridSize * 6) {
            this.firstMove = false;
        }
        else if (y !== GameBoard.gridSize * 1 && y !== GameBoard.gridSize * 6) {
            this.firstMove = false;
        }
        if (this.moveDownward) {
            this.captureDiagonally = [
                [1, 1],
                [-1, 1],
            ];
            if (this.firstMove) {
                return [
                    [0, 1],
                    [0, 2],
                ];
            }
            return [[0, 1]];
        }
        else {
            this.captureDiagonally = [
                [1, -1],
                [-1, -1],
            ];
            if (this.firstMove) {
                return [
                    [0, -1],
                    [0, -2],
                ];
            }
            return [[0, -1]];
        }
    }
    getLegalMoves(amounts) {
        this.legalMovesCoordinates = [];
        this.x = this.coordinate[0];
        this.y = this.coordinate[1];
        this.pieceType = Game.instance.map.gameMap[this.y][this.x];
        const TILE_TYPE = Game.instance.map.gameMap[this.y][this.x];
        this.isMyPieceBlack = TILE_TYPE === TILE_TYPE.toLowerCase();
        for (let n = 0; n < this.movementDirections.length; n++) {
            for (let i = 0; i < amounts; i++) {
                const NEW_X = this.x + (i + 1) * this.movementDirections[n][0];
                const NEW_Y = this.y + (i + 1) * this.movementDirections[n][1];
                if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0)
                    break;
                if (this.canMove(NEW_X, NEW_Y)) {
                    this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
                }
                else {
                    n++;
                    break;
                }
                if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY)
                    break;
            }
        }
        //capturing
        for (let n = 0; n < this.captureDiagonally.length; n++) {
            for (let i = 0; i < amounts; i++) {
                const NEW_X = this.x + (i + 1) * this.captureDiagonally[n][0];
                const NEW_Y = this.y + (i + 1) * this.captureDiagonally[n][1];
                if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0)
                    break;
                if (this.canCapture(NEW_X, NEW_Y)) {
                    this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
                }
                else {
                    break;
                }
                if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY)
                    break;
            }
        }
        Game.instance.playerControl.possibleTiles = this.legalMovesCoordinates;
    }
    //x,y diag
    canCapture(x, y) {
        if (Game.instance.map.gameMap[y][x] !== "0" &&
            (Game.instance.map.gameMap[y][x] ===
                Game.instance.map.gameMap[y][x].toLowerCase()) ===
                this.isMyPieceBlack)
            return false;
        if (this.isMyKingInCheck(x, y))
            return false;
        if (this.checkEnPassant(x, y))
            return true;
        if (Game.instance.map.gameMap[y][x] === Pieces.EMPTY)
            return false;
        return true;
    }
    checkEnPassant(x, y) {
        const CHECK_X = x * GameBoard.gridSize;
        const CHECK_Y = (y - this.captureDiagonally[0][1]) * GameBoard.gridSize;
        Game.instance.playerControl.toggleBlackToMove();
        const CHECK_PIECE = Game.instance.playerControl.choosePiece(CHECK_X, CHECK_Y);
        Game.instance.playerControl.toggleBlackToMove();
        if (CHECK_PIECE === undefined)
            return false;
        //only for pawn
        if (CHECK_PIECE.pieceType.toLowerCase() !== Pieces.PAWN ||
            !CHECK_PIECE.enPassantAvailable)
            return false;
        if (CHECK_PIECE.isPieceBlack === this.isMyPieceBlack)
            return false;
        Game.instance.playerControl.enPassant.push([
            CHECK_X / GameBoard.gridSize,
            CHECK_Y / GameBoard.gridSize + this.captureDiagonally[0][1],
        ]);
        return true;
    }
    // update enpassant
    enPassantUpdate(x, y) {
        Game.instance.map.gameMap[y - this.captureDiagonally[0][1]][x] =
            Pieces.EMPTY;
        const CHECK_X = x * GameBoard.gridSize;
        const CHECK_Y = (y - this.captureDiagonally[0][1]) * GameBoard.gridSize;
        Game.instance.playerControl.capturing(CHECK_X, CHECK_Y, Game.instance.playerControl.blackToMove);
    }
    canMove(x, y) {
        if (Game.instance.map.gameMap[y][x] !== Pieces.EMPTY)
            return false;
        if (this.isMyKingInCheck(x, y))
            return false;
        return true;
    }
    execute(x, y) {
        this.movementDirections = this.checkPossiblePawnMoves(y);
        this.checkPossibleMovements(x, y, 1);
    }
    getAllLegalMoves() {
        return this.legalMovesCoordinates;
    }
}
export { HandleMouseClickCommand, MovePieceCommand, MoveBishopCommand, MoveRookCommand, MoveQueenCommand, MoveKnightCommand, MoveKingCommand, MovePawnCommand, UpdatePositionToFirebaseCommand };
/**
 * gpt helps
 * sending all pieces, map grid and room id through firebase
 */
class UpdatePositionToFirebaseCommand {
    blackPieces;
    whitePieces;
    map;
    roomId;
    constructor(blackPieces, whitePieces, map, roomId) {
        this.blackPieces = blackPieces;
        this.whitePieces = whitePieces;
        this.map = map;
        this.roomId = roomId;
    }
    execute() {
        const blackPiecesData = this.blackPieces.map(piece => piece.toObject());
        const whitePiecesData = this.whitePieces.map(piece => piece.toObject());
        // Validate data to ensure no undefined values
        this.validateData(blackPiecesData);
        this.validateData(whitePiecesData);
        const isPlayerBlackTurn = !Game.instance.playerControl.isMyTurn; // Toggle turn
        update(ref(FirebaseClient.instance.db, `/rooms/${this.roomId}`), {
            blackPieces: blackPiecesData,
            whitePieces: whitePiecesData,
            map: this.map,
            isPlayerBlackTurn: isPlayerBlackTurn,
        }).then(() => {
            console.log("Data successfully written to Firebase");
        }).catch((error) => {
            console.error("Error writing to Firebase:", error);
        });
    }
    validateData(obj) {
        const stack = [obj];
        while (stack.length) {
            const currentObj = stack.pop();
            for (let key in currentObj) {
                if (currentObj[key] === undefined) {
                    throw new Error(`Undefined value found at ${key}`);
                }
                else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                    stack.push(currentObj[key]);
                }
            }
        }
    }
}
// gpt - Listening for game updates
function listenForGameUpdates() {
    const dbRef = ref(FirebaseClient.instance.db, `/gameState`);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        if (data) {
            console.log("Game state updated:", data);
            // Update local game state with the new data
            Game.instance.updateLocalGameState(data);
        }
    });
}
// Call the function to start listening for updates
listenForGameUpdates();
//# sourceMappingURL=Command.js.map