import { cartService } from "../services/cartService.js";
import { ticketService } from "../services/ticketService.js";

//@ts-check
class TicketsController {
    async addTicket(req, res) {  
        try {
          const user = req.session.user
          const userCartId = user.idCart
          const purchaser = user.email
          const ticketPreview = await ticketService.stockCartProductsForTicket(userCartId)
          const ticket = ticketPreview.cartWithStock
          const totalCart = ticketPreview.totalPriceTicket
          const oldProductsCart = ticketPreview.cartWithOutStock;
          //console.log("EEEEEEEEEE>>>>>  "+oldProductsCart.idProduct)
          
          const updateCart = await cartService.updateCart(userCartId, oldProductsCart )
          const savedTicket = await ticketService.addTicket(purchaser, ticket, totalCart)
        //   const ticketData = {
        //     code: "", // Función para generar el código único
        //     purchase_datetime: new Date(), // Fecha y hora actual
        //     amount: totalCart,
        //     purchaser: userEmail,
        //     products : ticket
        //     //cartId: ticketData.cartId
            
        // };  
          //console.log("EEEEEEEEEE>>>>>  "+updateCart)
          return res.render('finishticket', { ticket, totalCart, purchaser,savedTicket });      
          //res.status(200).render('chat', { });
        }catch (err) {
          res.status(500).json({ Error: `${err}` });
        };
    };

    async checkOut(req, res) {  
      try {
        const user = req.session.user
        const userCartId = user.idCart
        const cartProducts = await cartService.getProductsByCartId(userCartId)
        // ACA TENGO Q METER LO DL STOCK Y YA PASARLO A RENDERIZAR
        const ticketPreview = await ticketService.stockCartProductsForTicket(userCartId)
        //console.log(ticketPreview)
        return res.render('ticket', { user, cartProducts,ticketPreview });
      }catch (err) {
        res.status(500).json({ Error: `${err}` });
      };
    };
 //FIN LLAVE TicketSCONTROLLER     
};

export const ticketsController = new TicketsController();