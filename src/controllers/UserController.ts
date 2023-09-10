import { NextFunction, Request, Response, Router } from 'express';
import { MongooseError, isValidObjectId } from 'mongoose';

import Controller from './Controller';
import { IController } from '../interfaces/IController';

import UserModel from '../models/user.model';
import { IUser } from '../models/User/user.interface';
import CreateUserDto from '../models/DTO/user.create.dto';

import validationMiddleware from '../middleware/validation.middleware';

import NotFoundException from '../exceptions/NotFoundException';

import { asyncHandler } from '../utils/asyncHandler';

class UserController extends Controller implements IController {
  public path = '/users';
  public router = Router();
  private user = UserModel;

  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getUsers);
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDto),
      this.createUser
    );
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateUserDto, true),
      this.updateUser
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  public getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.user.find();
    if (users.length === 0) throw new NotFoundException('users');
    //this.sendResponce(res, users);
    res.json(users);
  });

  public getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      if (!isValidObjectId(id)) throw new MongooseError('invalid id');

      const user = await this.user.findById(id);
      if (user) res.json(user); //this.sendResponce(res, user);
      else throw new NotFoundException('User', id);
    }
  );

  public createUser = asyncHandler(async (req: Request, res: Response) => {
    const newUser: IUser = req.body;
    const createdUser = await UserModel.create(newUser);
    const { password, ...responseUser }: IUser = createdUser.toObject();
    //this.sendResponce(res, responseUser);
    res.json(responseUser);
  });

  public updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user: IUser = req.body;
    if (!isValidObjectId(id)) throw new MongooseError('invalid id');

    const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) throw new NotFoundException('User', id);

    const { password, ...responseUser }: IUser = updatedUser.toObject();
    //this.sendResponce(res, responseUser);
    res.json(responseUser);
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) throw new MongooseError('invalid id');

    const deletedUser = await this.user.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User', id);

    //this.sendResponce(res, `User with ${id}} deleted`);
    res.json({ message: `User with ${id}} deleted` });
  });
}

export default UserController;
