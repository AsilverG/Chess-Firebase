// import * as admin from "../functions/node_modules/firebase-admin";
// const db = admin.database();
// class QueueManager {
//   private queueRef = db.ref("gameQueue");
//   async addToQueue(userId: string): Promise<void> {
//     await this.queueRef.child(userId).set({
//       joinedAt: admin.database.ServerValue.TIMESTAMP,
//     });
//   }
//   async getQueueSize(): Promise<number> {
//     const snapshot = await this.queueRef.once("value");
//     return snapshot.numChildren();
//   }
//   async getPlayers(): Promise<string[]> {
//     const snapshot = await this.queueRef.orderByChild("joinedAt").once("value");
//     const players: string[] = [];
//     snapshot.forEach((childSnapshot) => {
//       players.push(childSnapshot.key as string);
//       if (players.length === 2) {
//         return true; // break the loop
//       }
//       return false;
//     });
//     return players;
//   }
//   async removeFromQueue(players: string[]): Promise<void> {
//     for (const player of players) {
//       await this.queueRef.child(player).remove();
//     }
//   }
// }
// export default QueueManager;
//# sourceMappingURL=QueueManager.js.map