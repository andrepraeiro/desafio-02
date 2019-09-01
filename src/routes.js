import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middleware/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users/', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups', MeetupController.delete);

routes.post('/subscription', SubscriptionController.store);

export default routes;
