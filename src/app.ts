import express, { Application } from 'express';
import cors from 'cors';
import { IController } from './interfaces/IController';

class App {
  public app: Application;
  private port: string | number;

  constructor(controllers: IController[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;

    this.initMiddlewares();
    this.initRoutes();
    this.initControllers(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Hello');
    });
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller) =>
      this.app.use('/api', controller.router)
    );
  }
}

export default App;
