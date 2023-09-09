import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import UserController from './controllers/UserController';
import ProjectController from './controllers/ProjectController';

const app = new App([new UserController(), new ProjectController()]);

app.listen();
