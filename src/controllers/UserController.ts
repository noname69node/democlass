import { Request, Response, Router } from 'express';
import { IUser } from '../models/User/user.interface';
import { isValidObjectId } from 'mongoose';
import { IController } from '../interfaces/IController';

class UserController implements IController {
  public path = '/users';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getUsers);
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.post(this.path, this.createUser);
  }

  private getUsers = (req: Request, res: Response) => {
    res.json({ message: 'get all users' });
  };

  private getUser = (req: Request, res: Response) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) res.json({ message: `not valid id` });
    res.json({ message: `get user ${id}` });
  };

  private createUser = (req: Request, res: Response) => {
    const user: IUser = req.body;

    res.json(user);
  };
}

export default UserController;
