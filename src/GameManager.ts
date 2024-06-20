// import * as admin from "../functions/node_modules/firebase-admin";

// const db = admin.database();

// class GameManager {
//   private gamesRef = db.ref("games");
//   public static _instance: GameManager | null;

//   public static get instance(): GameManager {
//     if (GameManager._instance == undefined) {
//       GameManager._instance = new GameManager();
//     }
//     return GameManager._instance;
//   }

//   async createGame(player1: string, player2: string): Promise<string> {
//     const gameRef = this.gamesRef.push();
//     await gameRef.set({
//       player1,
//       player2,
//       status: "ongoing",
//       createdAt: admin.database.ServerValue.TIMESTAMP,
//       boardState: "initial_board_state_FEN", // Set the initial FEN state here
//       moves: {},
//     });
//     return gameRef.key as string;
//   }

//   async makeMove(
//     gameId: string,
//     from: string,
//     to: string,
//     playerId: string
//   ): Promise<void> {
//     const moveRef = this.gamesRef.child(gameId).child("moves").push();
//     await moveRef.set({
//       from,
//       to,
//       timestamp: admin.database.ServerValue.TIMESTAMP,
//       player: playerId,
//     });

//     // Optionally, update the boardState here if you are maintaining a FEN or other state representation
//     // const newBoardState = this.updateBoardState(from, to);
//     // await this.gamesRef.child(gameId).update({ boardState: newBoardState });
//   }
// }

// export default GameManager;
