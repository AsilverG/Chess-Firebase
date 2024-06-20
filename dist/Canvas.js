import { Game } from "./Game.js";
class Canvas {
    static _instance;
    static get instance() {
        if (Canvas._instance === undefined) {
            Canvas._instance = new Canvas();
        }
        return Canvas._instance;
    }
    screen = document.getElementById("chess-board");
    _context = this.screen.getContext("2d");
    static WIDTH = 90 * 8;
    static HEIGHT = 90 * 8;
    constructor() {
        this.screen.width = Canvas.WIDTH;
        this.screen.height = Canvas.HEIGHT;
    }
    static clearScreen() {
        Canvas.instance.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    }
    get context() {
        return this._context;
    }
    startGame(isPlayerBlack, roomId) {
        Game.instance.start(isPlayerBlack, roomId);
    }
}
export { Canvas };
//# sourceMappingURL=Canvas.js.map