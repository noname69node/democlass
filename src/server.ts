import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import UserController from "./controllers/UserController";

const app = new App([new UserController()]);

app.listen();
