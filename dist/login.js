// import GameClient from "./GameClient.js";
// const registerButton = document.getElementById("login") as HTMLButtonElement;
// const emailInput = document.getElementById("email") as HTMLInputElement;
// const passwordInput = document.getElementById("password") as HTMLInputElement;
// GameClient.instance.onAuthStateChanged((user) => {
//   if (user) {
//     window.location.href = "game.html";
//   }
// });
// registerButton.addEventListener("click", async () => {
//   const email = emailInput.value;
//   const password = passwordInput.value;
//   console.log("click");
//   try {
//     await GameClient.instance.signIn(email, password);
//     alert("login successfully!");
//     window.location.href = "game.html";
//   } catch (error) {
//     if (error instanceof Error) {
//       alert("Error loggin in: " + error.message);
//     } else {
//       alert("An unknown error occurred.");
//     }
//   }
// });
//# sourceMappingURL=login.js.map