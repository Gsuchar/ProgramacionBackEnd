import { Router } from 'express';
import { ticketsController } from '../controllers/ticketController.js';
import { isLoged, isUser } from '../middlewares/auth.js';


const routerTicket = Router();

routerTicket.get("/checkout", isLoged, isUser, ticketsController.checkOut);
routerTicket.get("/finishticket", isLoged, isUser, ticketsController.addTicket);

export default routerTicket;