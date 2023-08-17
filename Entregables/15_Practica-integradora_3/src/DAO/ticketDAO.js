//@ts-check
import { TicketModel } from "./mongo/models/ticketModel.js";
//--


export class TicketDAO{
  async addTicket(newTicket) {
    try {
    const ticket = await TicketModel.create(newTicket);
    // Asigno a code el _id para que code sea unico tambien.
    ticket.code = ticket._id.toString();
    // Actualizo el ticket en mongo 
    await TicketModel.findByIdAndUpdate(ticket._id, { code: ticket.code });
    return ticket;
    } catch (err) {
      throw (`FALLO EN MODELO.`);
    }
  }

}

export const ticketDAO = new TicketDAO();


