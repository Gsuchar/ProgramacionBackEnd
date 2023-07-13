import { Router } from 'express';
import { isUser, isAdmin, multerUploadFile } from '../middlewares/checkAuth.js';
import { jugadoresController } from '../controllers/jugadores.controller.js';
export const jugadoresRouter = new Router();

jugadoresRouter.get('/jugadores', jugadoresController.getAll);
jugadoresRouter.get('/jugadores/:jid', jugadoresController.getById);
jugadoresRouter.post('/jugadores', isAdmin, multerUploadFile, jugadoresController.create);
jugadoresRouter.put('/jugadores/:jid', isAdmin, multerUploadFile, jugadoresController.edit);
jugadoresRouter.delete('/jugadores/:jid', jugadoresController.delete);

