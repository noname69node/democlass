import { Response } from "express";
import { IUser } from "../models/user.model";

class Controller {
  constructor() {}

  public sendResponce(res: Response, data: any) {
    return res.json({ data });
  }
}

export default Controller;
