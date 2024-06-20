// // Import the necessary Firebase modules from the CDN
// import {
//   httpsCallable,
//   getFunctions,
//   //@ts-ignore import module
// } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-functions.js";
// import {
//   signInWithEmailAndPassword,
//   signOut,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   getAuth,
//   //@ts-ignore
// } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import firebaseConfig from "./config.js";
// import {
//   initializeApp,
//   getApps,
//   getApp,
//   //@ts-ignore
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// class GameClient {
//   private static _instance: GameClient | null = null;
//   private app;
//   private auth;
//   private functions;
//   private constructor() {
//     if (!getApps().length) {
//       this.app = initializeApp(firebaseConfig);
//     } else {
//       this.app = getApp();
//     }
//     this.auth = getAuth(this.app);
//     this.functions = getFunctions(this.app);
//   }
//   public static get instance() {
//     if (!GameClient._instance) {
//       GameClient._instance = new GameClient();
//     }
//     return GameClient._instance;
//   }
//   async joinQueue(): Promise<{ gameId?: string; message?: string }> {
//     try {
//       const user = this.auth.currentUser;
//       if (!user) {
//         throw new Error("User not authenticated");
//       }
//       const joinQueueFunction = httpsCallable(this.functions, "joinQueue");
//       const result = await joinQueueFunction();
//       return result.data;
//     } catch (error) {
//       console.error("Error joining queue:", error);
//       throw error;
//     }
//   }
//   async signIn(email: string, password: string): Promise<void> {
//     try {
//       await signInWithEmailAndPassword(this.auth, email, password);
//     } catch (error) {
//       console.error("Error signing in:", error);
//       throw error;
//     }
//   }
//   async signOut(): Promise<void> {
//     try {
//       await signOut(this.auth);
//     } catch (error) {
//       console.error("Error signing out:", error);
//       throw error;
//     }
//   }
//   async register(email: string, password: string): Promise<void> {
//     try {
//       await createUserWithEmailAndPassword(this.auth, email, password);
//     } catch (error) {
//       console.error("Error registering:", error);
//       throw error;
//     }
//   }
//   onAuthStateChanged(callback: (user) => void): void {
//     onAuthStateChanged(this.auth, callback);
//   }
// }
// export default GameClient;
//# sourceMappingURL=GameClient.js.map