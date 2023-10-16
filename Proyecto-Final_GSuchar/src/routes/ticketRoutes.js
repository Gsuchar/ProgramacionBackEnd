import { Router } from 'express';
import { ticketsController } from '../controllers/ticketController.js';
import { isLoged, isUser } from '../middlewares/auth.js';
//--

const routerTicket = Router();

// CHECKOUT ANTES DE FINALIZAR LA COMPRA
routerTicket.get("/checkout", isLoged, isUser, ticketsController.checkOut);
//FINALIZA LA COMPRA Y CREA TICKET
routerTicket.get("/finishticket", isLoged, isUser, ticketsController.addTicket);

export default routerTicket;