import { ticketModel_2 } from '../DAO/mongo/models/ticketModel.js';
import { cartService } from './cartService.js';

export class TicketService {
    async addTicket(purchaser, ticket, totalCart) {
        try {
          const ticketData = {
            code: "", // Función para generar el código único
            purchase_datetime: new Date(), // Fecha y hora actual
            amount: totalCart,
            purchaser: purchaser,
            products : ticket            
        };              
        const savedTicket = await ticketModel_2.addTicket(ticketData);
        console.log("serv TICKET>>>  "+ JSON.stringify(savedTicket))
        //savedTicket.map((t) => savedTicket.code =="" ?   { ...t, code: t._id } : '');
        // if (savedTicket.code === "") {
        //     savedTicket.code = savedTicket._id;
        // }
        savedTicket.code === "" ? savedTicket.code = savedTicket._id: '' ;
        return savedTicket;
        } catch (error) {
        //throw error;
        throw (`FALLO EN SERVICIO. ${error}`);
        }
    }

    async  stockCartProductsForTicket(cartId) {
        try {
            const cartProductsTicket = await cartService.getProductsByCartId(cartId);
            let cartWithStock = [];
            let cartWithOutStock = [];
            let totalPriceTicket = 0;
    
            cartProductsTicket.cartProducts.forEach((item) => {
                const idProduct = item.idProduct;
                const quantityInCart = parseInt(item.quantity);
                const availableStock = parseInt(idProduct.stock);
                const ticketAmount = parseInt(idProduct.price);
    
                if (quantityInCart <= availableStock) {
                    const totalPriceProduct = ticketAmount * quantityInCart;
                    cartWithStock.push({ idProduct, quantity: quantityInCart, totalPrice: totalPriceProduct });
                    totalPriceTicket += totalPriceProduct;
                } else {
                    cartWithOutStock.push({ idProduct, quantity: quantityInCart });
                }
            });
    
            return { cartWithStock, cartWithOutStock, totalPriceTicket };
        } catch (err) {
            throw new Error("ERROR.");
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