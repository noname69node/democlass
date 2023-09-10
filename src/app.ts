import express, { Application } from "express";
import cors from "cors";
import { IController } from "./interfaces/IController";
import connect from "./utils/connect";
import logger from "./utils/logger";
import errorMiddleware from "./middleware/error.middleware";
//import pino from 'pino-http';

class App {
  public app: Application;
  private port: string | number;

  constructor(controllers: IController[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;

    this.connectToDB();
    this.initMiddlewares();
    this.initRoutes();
    this.initRoutesFromControllers(controllers);
    this.initErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`App running on port ${this.port}`);
    });
  }

  private async connectToDB() {
    await connect();
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    //this.app.use(pino());
  }

  private initRoutes() {
    this.app.get("/", (req, res) => {
      res.send("Hello");
    });
  }

  private initRoutesFromControllers(controllers: IController[]) {
    controllers.forEach((controller) => this.app.use("/api", controller.router));
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
