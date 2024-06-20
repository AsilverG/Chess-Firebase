import ChessPiece from "./ChessPiece.js";
import { GameBoard, Pieces } from "./Board.js";
import { Canvas } from "./Canvas.js";
import {Game} from "./Game.js";
import BaseTile from "./Tile.js";
import { WhitePieceFactory } from "./PieceFactory.js";
import { BlackPieceFactory } from "./PieceFactory.js";
//@ts-ignore Import module 

import {
  update,
  ref,
  onDisconnect,
  onValue
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { FirebaseClient } from "./firebaseclient.js";



interface Command {
  execute(x: number, y: number): void;
}

abstract class HandleMouseClickCommand implements Command {
  protected mousePositionX: number = 0;
  protected mousePositionY: number = 0;

  public assignCoordinates(x: number, y: number): Command {
    this.mousePositionX = x;
    this.mousePositionY = y;
    return this;
  }

  abstract execute(x: number, y: number): void;
}

abstract class MovePieceCommand implements Command {
  //@ts-ignore
  protected pieceType: string;
  //@ts-ignore
  protected isMyPieceBlack: boolean;
  //@ts-ignore
  protected movementDirections: number[][];
  //@ts-ignore
  protected tempGameMap: string[][];
  //@ts-ignore
  protected coordinate: number[];

  protected isOpponentKingInCheck: boolean = false;

  protected legalMovesCoordinates: number[][] = [];
  //@ts-ignore
  protected fromTile: BaseTile;
  //@ts-ignore
  protected x: number;
  //@ts-ignore
  protected y: number;

  constructor() {}

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }

  abstract getAllLegalMoves(): number[][];

  protected checkPossibleMovements(
    x: number,
    y: number,
    amounts: number
  ): void {
    this.getStartingCoordinatesAndTile(x, y);
    this.getLegalMoves(amounts);
    this.fillColors();
  }

  protected fillColors(): void {
    Canvas.instance.context.globalAlpha = 0.5;
    for (let i = 0; i < this.legalMovesCoordinates.length; i++) {
      Canvas.instance.context.beginPath();
      Canvas.instance.context.fillStyle = "red";
      Canvas.instance.context.arc(
        this.legalMovesCoordinates[i][0] * GameBoard.gridSize +
          GameBoard.gridSize / 2,
        this.legalMovesCoordinates[i][1] * GameBoard.gridSize +
          GameBoard.gridSize / 2,
        GameBoard.gridSize / 4,
        0,
        2 * Math.PI
      );
      Canvas.instance.context.fill();
      Canvas.instance.context.closePath();
    }
    Canvas.instance.context.globalAlpha = 1;
  }

  protected checkCastling(d: number, x: number, y: number): boolean {
    return 1 !== 1;
  }

  protected getStartingCoordinatesAndTile(x: number, y: number): void {
    this.x = Math.floor(x / GameBoard.gridSize);
    this.y = Math.floor(y / GameBoard.gridSize);
    this.fromTile = Game.instance.map.tileMap[this.y][this.x];
    this.coordinate = this.fromTile.tileCoordinates(x, y);
  }

  protected getLegalMoves(amounts: number): void {
    this.legalMovesCoordinates = [];
    this.x = this.coordinate[0];
    this.y = this.coordinate[1];
    this.pieceType = Game.instance.map.gameMap[this.y][this.x];
    const TILE_TYPE: string = Game.instance.map.gameMap[this.y][this.x];
    this.isMyPieceBlack = TILE_TYPE === TILE_TYPE.toLowerCase();
    for (let n = 0; n < this.movementDirections.length; n++) {
      // console.log(this.movementDirections.length)
      for (let i = 0; i < amounts; i++) {
        // console.log(amounts)
        const NEW_X: number = this.x + (i + 1) * this.movementDirections[n][0];
        const NEW_Y: number = this.y + (i + 1) * this.movementDirections[n][1];
        // console.log(NEW_Y,NEW_X)
        if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0) break;

        //castling
        if (
          Math.abs(this.movementDirections[n][0]) === 2 &&
          TILE_TYPE.toLowerCase() === Pieces.KING
        ) {
          if (this.checkCastling(this.movementDirections[n][0], this.x, this.y))
            this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
        } else if (this.canMove(NEW_X, NEW_Y)) {
          this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
        }
        if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY) break;
      }
    }
    Game.instance.playerControl.possibleTiles = this.legalMovesCoordinates;
  }

  protected canMove(x: number, y: number): boolean {
    if (
      Game.instance.map.gameMap[y][x] !== Pieces.EMPTY &&
      (Game.instance.map.gameMap[y][x] ===
        Game.instance.map.gameMap[y][x].toLowerCase()) ===
        this.isMyPieceBlack
    ) {
      // console.log(Game.instance.map.gameMap[y][x], y, x, this.isMyPieceBlack)
      return false;
    }
    // console.log(this.isMyKingInCheck(x, y))
    if (this.isMyKingInCheck(x, y)) return false;
    return true;
  }

  protected isMyKingInCheck(x: number, y: number): boolean {
    this.copyBoard();
    this.tempGameMap[this.y][this.x] = Pieces.EMPTY; // Simulate move by emptying current position
    this.tempGameMap[y][x] = this.pieceType; // Place piece on new position
    const kingPosition = this.findKingPosition();
    // console.log(kingPosition);
    // console.log("Temporary game map initialized:", this.tempGameMap);
    return this.isSquareAttacked(kingPosition[1], kingPosition[0]); // 3,5
  }

  protected copyBoard(): void {
    this.tempGameMap = [];
    for (let r = 0; r < Game.instance.map.ROWS; r++) {
      this.tempGameMap[r] = []; // Initialize each row as an empty array
      for (let c = 0; c < Game.instance.map.COLUMNS; c++) {
        this.tempGameMap[r][c] = Game.instance.map.gameMap[r][c];
      }
    }
    // console.log("Temporary game map initialized:", this.tempGameMap);
  }

  protected findKingPosition(): number[] {
    let isMyKingBlack: boolean;

    for (let r = 0; r < this.tempGameMap.length; r++) {
      for (let c = 0; c < this.tempGameMap[r].length; c++) {
        const PIECE: string = this.tempGameMap[r][c];
        // if(PIECE.toLowerCase() !== Pieces.KING || !this.isMyPieceBlack || PIECE !== PIECE.toLowerCase() ){
        //   continue;
        // } else if (PIECE.toLowerCase() !== Pieces.KING || this.isMyPieceBlack || PIECE !== PIECE.toUpperCase()){
        //   continue;
        // }
        // console.log(PIECE.toLowerCase());
        // console.log(!this.isMyPieceBlack);
        // console.log(PIECE );
        // console.log(PIECE.toLowerCase());
        // return [r,c];
        if (PIECE.toLowerCase() === Pieces.KING) {
          isMyKingBlack = PIECE === PIECE.toLowerCase();
          if (isMyKingBlack && this.isMyPieceBlack) {
            return [r, c];
          } else if (!isMyKingBlack && !this.isMyPieceBlack) {
            return [r, c];
          }
        }
      }
    }
    throw new Error("No King");
  }

  protected isSquareAttacked(x: number, y: number): boolean {
    let check: boolean = false;

    const DIAGONAL_ATTACKS: number[][] = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    const DIAGONAL_ATTACKERS: string[] = [Pieces.BISHOP, Pieces.QUEEN];

    const STRAIGHT_ATTACKS: number[][] = [
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1],
    ];
    const STRAIGHT_ATTACKERS: string[] = [Pieces.ROOK, Pieces.QUEEN];

    const KNIGHT_ATTACKS: number[][] = [
      [2, -1],
      [2, 1],
      [1, 2],
      [1, -2],
      [-2, 1],
      [-2, -1],
      [-1, 2],
      [-1, -2],
    ];

    for (let n = 0; n < DIAGONAL_ATTACKS.length; n++) {
      for (let i = 0; i < 7; i++) {
        const CHECK_X: number = x + (i + 1) * DIAGONAL_ATTACKS[n][0];
        const CHECK_Y: number = y + (i + 1) * DIAGONAL_ATTACKS[n][1];

        if (CHECK_X > 7 || CHECK_Y > 7 || CHECK_Y < 0 || CHECK_X < 0) break;
        const PIECE: string = this.tempGameMap[CHECK_Y][CHECK_X];

        if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
          if (PIECE.toLowerCase() === Pieces.KING && i === 0) {
            check = true;
            return check;
          }
          if (PIECE.toLowerCase() === Pieces.PAWN && i === 0) {
            let isPawnBlack: boolean;
            isPawnBlack = PIECE === PIECE.toLowerCase();

            if (isPawnBlack === Game.instance.map.isPlayerBlack) {
              if (DIAGONAL_ATTACKS[n][1] === 1) {
                check = true;
                return check;
              }
            } else if (isPawnBlack !== Game.instance.map.isPlayerBlack) {
              if (DIAGONAL_ATTACKS[n][1] === -1) {
                check = true;
                return check;
              }
            }
            // console.log("pawn");
          }
          if (DIAGONAL_ATTACKERS.includes(PIECE.toLowerCase())) {
            // console.log(PIECE);
            // console.log("dia");
            check = true;
            return check;
          }
        }
        if (PIECE !== Pieces.EMPTY) break;
      }
    }

    for (let n = 0; n < STRAIGHT_ATTACKS.length; n++) {
      for (let i = 0; i < 7; i++) {
        const CHECK_X: number = x + (i + 1) * STRAIGHT_ATTACKS[n][0];
        const CHECK_Y: number = y + (i + 1) * STRAIGHT_ATTACKS[n][1];
        if (CHECK_X > 7 || CHECK_Y > 7 || CHECK_Y < 0 || CHECK_X < 0) break;

        const PIECE: string = this.tempGameMap[CHECK_Y][CHECK_X];

        if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
          if (PIECE.toLowerCase() === Pieces.KING && i === 0) {
            check = true;
            return check;
          }
          if (STRAIGHT_ATTACKERS.includes(PIECE.toLowerCase())) {
            // console.log("str")
            check = true;
            return check;
          }
        }
        if (PIECE !== Pieces.EMPTY) break;
      }
    }

    for (let i = 0; i < KNIGHT_ATTACKS.length; i++) {
      const CHECK_X: number = x + KNIGHT_ATTACKS[i][0];
      const CHECK_Y: number = y + KNIGHT_ATTACKS[i][1];
      if (CHECK_X <= 7 && CHECK_Y <= 7 && CHECK_Y >= 0 && CHECK_X >= 0) {
        const PIECE: string = this.tempGameMap[CHECK_Y][CHECK_X];
        if (!((PIECE === PIECE.toLowerCase()) === this.isMyPieceBlack)) {
          if (PIECE.toLowerCase() === Pieces.KNIGHT) {
            // console.log("kni")
            check = true;
            return check;
          }
        }
      }
    }
    console.log(`RETURNNING        ${check}`);
    return check;
  }

  public isGameOver(forBlack: boolean): boolean {
    let legalMoves: boolean = false;
    if (forBlack) {
      for (let i = 0; i < Game.instance.blackPiecesOnTheBoard.length; i++) {
        if (Game.instance.blackPiecesOnTheBoard[i].getLegalMoves().length > 0) {
          legalMoves = true;
          return legalMoves;
        }
      }
    } else {
      for (let i = 0; i < Game.instance.whitePiecesOnTheBoard.length; i++) {
        if (Game.instance.whitePiecesOnTheBoard[i].getLegalMoves().length > 0) {
          legalMoves = true;
          return legalMoves;
        }
      }
    }
    this.copyBoard();

    // change it later
    this.isMyPieceBlack = !this.isMyPieceBlack;
    const kingPosition = this.findKingPosition();
    console.log(kingPosition);
    // console.log("Temporary game map initialized:", this.tempGameMap);
    if (this.isSquareAttacked(kingPosition[1], kingPosition[0])) {
      console.log("Checkmate");
    } else {
      console.log("Stalemate");
    }
    return legalMoves;
  }
}

class MoveBishopCommand extends MovePieceCommand {
  public movementDirections: number[][] = [
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ];

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }

  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}

class MoveRookCommand extends MovePieceCommand {
  public movementDirections: number[][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }

  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}

class MoveQueenCommand extends MovePieceCommand {
  public movementDirections: number[][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ];

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, Game.instance.map.ROWS - 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }
  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}

class MoveKnightCommand extends MovePieceCommand {
  public movementDirections: number[][] = [
    [2, 1],
    [2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [-2, 1],
    [-2, -1],
  ];

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }
  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}

class MoveKingCommand extends MovePieceCommand {
  public movementDirections: number[][] = [
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

  public execute(x: number, y: number): void {
    this.checkPossibleMovements(x, y, 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();

  }

  public checkCastling(d: number, x: number, y: number): boolean {
    this.copyBoard();
    if (this.isSquareAttacked(x, y)) return false;
    let kingPiece: ChessPiece = Game.instance.playerControl.choosePiece(
      x * GameBoard.gridSize,
      y * GameBoard.gridSize
    );
    if (kingPiece.firstMove !== true) return false;

    let isQueenSideCastling: boolean;
    if (d > 0 && Game.instance.map.isPlayerBlack) {
      isQueenSideCastling = true;
    } else {
      isQueenSideCastling = false;
    }

    if (isQueenSideCastling) return this.queenSideCastling(x, y);
    return this.kingSideCastling(x, y);
  }

  private kingSideCastling(x: number, y: number): boolean {
    return false;
  }

  private queenSideCastling(x: number, y: number): boolean {
    let checkTiles: number;
    if (Game.instance.map.isPlayerBlack) {
      checkTiles = 1;
    } else {
      checkTiles = -1;
    }

    let rookPiece: ChessPiece = Game.instance.playerControl.choosePiece(
      (x + 4 * checkTiles) * GameBoard.gridSize,
      y * GameBoard.gridSize
    );
    if (rookPiece.pieceType.toLowerCase() !== Pieces.ROOK) return false;
    if (rookPiece.firstMove !== true) return false;

    //0,-1,-2,-3
    for (let i = checkTiles; Math.abs(i) < 3; i = i + checkTiles) {
      console.log(y, x + i);
      console.log(Game.instance.map.gameMap[y][x + i]);
      if (Game.instance.map.gameMap[y][x + i] !== Pieces.EMPTY) return false;
      this.copyBoard();
      console.log(this.isSquareAttacked(y, x + i));
      if (this.isSquareAttacked(y, x + i)) return false;
    }
    return true;
  }

  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}

class MovePawnCommand extends MovePieceCommand {
  constructor(
    readonly moveDownward: boolean,
  ) {
    super();
  }
  //@ts-ignore
  private captureDiagonally: number[][];

  private firstMove: boolean = true;

  private checkPossiblePawnMoves(y: number): number[][] {
    console.log(y)
    if(y !== GameBoard.gridSize * 6) {
      this.firstMove = false;
    } else if (y !== GameBoard.gridSize * 1 && y !== GameBoard.gridSize * 6){
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
    } else {
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

  protected getLegalMoves(amounts: number): void {
    this.legalMovesCoordinates = [];
    this.x = this.coordinate[0];
    this.y = this.coordinate[1];
    this.pieceType = Game.instance.map.gameMap[this.y][this.x];
    const TILE_TYPE: string = Game.instance.map.gameMap[this.y][this.x];
    this.isMyPieceBlack = TILE_TYPE === TILE_TYPE.toLowerCase();
    for (let n = 0; n < this.movementDirections.length; n++) {
      for (let i = 0; i < amounts; i++) {
        const NEW_X: number = this.x + (i + 1) * this.movementDirections[n][0];
        const NEW_Y: number = this.y + (i + 1) * this.movementDirections[n][1];
        if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0) break;
        if (this.canMove(NEW_X, NEW_Y)) {
          this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
        } else {
          n++;
          break;
        }
        if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY) break;
      }
    }

    //capturing
    for (let n = 0; n < this.captureDiagonally.length; n++) {
      for (let i = 0; i < amounts; i++) {
        const NEW_X: number = this.x + (i + 1) * this.captureDiagonally[n][0];
        const NEW_Y: number = this.y + (i + 1) * this.captureDiagonally[n][1];
        if (NEW_X < 0 || NEW_Y > 7 || NEW_X > 7 || NEW_Y < 0) break;
        if (this.canCapture(NEW_X, NEW_Y)) {
          this.legalMovesCoordinates.push([NEW_X, NEW_Y]);
        } else {
          break;
        }
        if (Game.instance.map.gameMap[NEW_Y][NEW_X] !== Pieces.EMPTY) break;
      }
    }
    Game.instance.playerControl.possibleTiles = this.legalMovesCoordinates;
  }

  //x,y diag
  protected canCapture(x: number, y: number): boolean {
    if (
      Game.instance.map.gameMap[y][x] !== "0" &&
      (Game.instance.map.gameMap[y][x] ===
        Game.instance.map.gameMap[y][x].toLowerCase()) ===
        this.isMyPieceBlack
    )
      return false;

    if (this.isMyKingInCheck(x, y)) return false;

    if (this.checkEnPassant(x, y)) return true;

    if (Game.instance.map.gameMap[y][x] === Pieces.EMPTY) return false;

    return true;
  }

  private checkEnPassant(x: number, y: number): boolean {
    const CHECK_X: number = x * GameBoard.gridSize;
    const CHECK_Y: number =
      (y - this.captureDiagonally[0][1]) * GameBoard.gridSize;

    Game.instance.playerControl.toggleBlackToMove();
    const CHECK_PIECE: ChessPiece = Game.instance.playerControl.choosePiece(
      CHECK_X,
      CHECK_Y
    );
    Game.instance.playerControl.toggleBlackToMove();

    if (CHECK_PIECE === undefined) return false;
    if (
      CHECK_PIECE.pieceType.toLowerCase() !== Pieces.PAWN ||
      !CHECK_PIECE.enPassantAvailable
    )
      return false;
    if (CHECK_PIECE.isPieceBlack === this.isMyPieceBlack) return false;
    Game.instance.playerControl.enPassant.push([
      CHECK_X / GameBoard.gridSize,
      CHECK_Y / GameBoard.gridSize + this.captureDiagonally[0][1],
    ]);
    return true;
  }

  public enPassantUpdate(x: number, y: number) {
    Game.instance.map.gameMap[y - this.captureDiagonally[0][1]][x] =
      Pieces.EMPTY;
    const CHECK_X: number = x * GameBoard.gridSize;
    const CHECK_Y: number =
      (y - this.captureDiagonally[0][1]) * GameBoard.gridSize;
    Game.instance.playerControl.capturing(
      CHECK_X,
      CHECK_Y,
      Game.instance.playerControl.blackToMove
    );
  }

  protected canMove(x: number, y: number): boolean {
    if (Game.instance.map.gameMap[y][x] !== Pieces.EMPTY) return false;
    if (this.isMyKingInCheck(x, y)) return false;
    return true;
  }

  public execute(x: number, y: number): void {
    this.movementDirections = this.checkPossiblePawnMoves(y);
    // console.log(this.movementDirections);
    // console.log(this.parentPiece.firstMove)
    this.checkPossibleMovements(x, y, 1);
    // new UpdatePositionToFirebaseCommand(Game.instance.blackPiecesOnTheBoard, Game.instance.whitePiecesOnTheBoard, Game.instance.map.gameMap).execute();
    // console.log(this.legalMovesCoordinates)
  }

  public getAllLegalMoves(): number[][] {
    return this.legalMovesCoordinates;
  }
}


// class UpdatePositionToFirebaseCommand implements Command {
//   constructor(private blackPieces: ChessPiece[], private whitePieces: ChessPiece[], private map: string[][]) {}

//   public execute(): void {
//     const blackPiecesData = this.blackPieces.map(piece => piece.toObject());
//     const whitePiecesData = this.whitePieces.map(piece => piece.toObject());

//     // Validate data to ensure no undefined values
//     validateData(blackPiecesData);
//     validateData(whitePiecesData);

//     update(ref(FirebaseClient.instance.db, `/players`), {
//       blackPieces: blackPiecesData,
//       whitePieces: whitePiecesData,
//       map: this.map,
//     }).then(() => {
//       console.log("Data successfully written to Firebase");
//     }).catch((error) => {
//       console.error("Error writing to Firebase:", error);
//     });
//   }
// }

// function validateData(obj: any) {
//   const stack = [obj];
//   while (stack.length) {
//     const currentObj = stack.pop();
//     for (let key in currentObj) {
//       if (currentObj[key] === undefined) {
//         throw new Error(`Undefined value found at ${key}`);
//       } else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
//         stack.push(currentObj[key]);
//       }
//     }
//   }
// }




export {
  Command,
  HandleMouseClickCommand,
  MovePieceCommand,
  MoveBishopCommand,
  MoveRookCommand,
  MoveQueenCommand,
  MoveKnightCommand,
  MoveKingCommand,
  MovePawnCommand,
  UpdatePositionToFirebaseCommand
};




class UpdatePositionToFirebaseCommand implements Command {
  constructor(private blackPieces: ChessPiece[], private whitePieces: ChessPiece[], private map: string[][], private roomId: string) {}

  public execute(): void {
    const blackPiecesData = this.blackPieces.map(piece => piece.toObject());
    const whitePiecesData = this.whitePieces.map(piece => piece.toObject());

    // Validate data to ensure no undefined values
    validateData(blackPiecesData);
    validateData(whitePiecesData);

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
}

function validateData(obj: any) {
  const stack = [obj];
  while (stack.length) {
    const currentObj = stack.pop();
    for (let key in currentObj) {
      if (currentObj[key] === undefined) {
        throw new Error(`Undefined value found at ${key}`);
      } else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
        stack.push(currentObj[key]);
      }
    }
  }
}







// Listening for game updates
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

// function updateLocalGameState(data: any) {
  
//   // Update pieces on the board
//   Game.instance.blackPiecesOnTheBoard = data.blackPieces.map((pieceData: any) => BlackPieceFactory.make(pieceData.pieceType as Pieces, pieceData.x, pieceData.y, pieceData.firstMove));
//   Game.instance.whitePiecesOnTheBoard = data.whitePieces.map((pieceData: any) => WhitePieceFactory.make(pieceData.pieceType as Pieces, pieceData.x, pieceData.y, pieceData.firstMove));
  
//   // Update game map
//   Game.instance.map.gameMap = data.map;
//   console.log(data.map)

//   // Toggle turn
//   Game.instance.playerControl.isMyTurn = !data.isPlayerBlackTurn;

//   // Redraw the board
//   Game.instance.map.drawMap();
//   Game.instance.drawAll();
// }

// Call the function to start listening for updates
listenForGameUpdates();
