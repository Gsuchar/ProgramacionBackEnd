import { ticketModel_2 } from '../DAO/mongo/models/ticketModel.js';

export class TicketService {
    async addTicket(ticketData) {
        try {
        const ticket = {
            code: "", // Función para generar el código único
            purchase_datetime: new Date(), // Fecha y hora actual
            amount: ticketData.amount,
            purchaser: ticketData.purchaser,
            cartId: ticketData.cartId
        };    
        const savedTicket = await ticketModel_2.addTicket(ticket);
        savedTicket.map((t) => savedTicket.code =="" ?   savedTicket.code = t._id : '');
        return savedTicket;
        } catch (error) {
        throw error;
        }
    }
    
    // // Función para generar un código único para el ticket
    // function generateUniqueCode() {
    //     // Aquí implementa la lógica para generar un código único para el ticket
    //     // Puedes utilizar alguna librería como `uuid` para esto.
    //     // Ejemplo con uuidv4: return uuidv4();
    // }        
    

 //FIN LLAVE TICKETSERVICE    
};

export const ticketService = new TicketService();