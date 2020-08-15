import express from 'express';

import ClassesController from './controllers/ClassesController';

import ConectionsController from './controllers/ConnectiosController';

const routes = express.Router();

const classesControllers = new ClassesController();
const conectionsController = new ConectionsController();

routes.post('/classes', classesControllers.create);
routes.get('/classes', classesControllers.index);

routes.post('/connections', conectionsController.create);
routes.get('/connections', conectionsController.index);

export default routes;