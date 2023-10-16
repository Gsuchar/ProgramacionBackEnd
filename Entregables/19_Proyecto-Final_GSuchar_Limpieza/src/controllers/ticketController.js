import { cartService } from "../services/cartService.js";
import { ticketService } from "../services/ticketService.js";
//---


class TicketsController {
  
  async addTicket(req, res) {  
      try {
        const user = req.session.user
        const userCartId = user.idCart;
        const purchaser = user.email;
        const ticketPreview = await ticketService.stockCartProductsForTicket(userCartId);
        const ticket = ticketPreview.cartWithStock;
        const totalCart = ticketPreview.totalPriceTicket;
        const oldProductsCart = ticketPreview.cartWithOutStock;
        totalCart <= 0  ? (() => { throw ("Debe tener productos en el carrito para continuar.") })() : "";
        await cartService.updateCart(userCartId, oldProductsCart );
        await ticketService.addTicket(purchaser, ticket, totalCart);
        return res.render('finishticket', { ticket, totalCart, purchaser });      
      }catch (err) {
        res.status(500).render('error', { error: err  });
      };
  };

  async checkOut(req, res) {  
    try {
      const user = req.session.user;
      const userCartId = user.idCart;
      const cartProducts = await cartService.getProductsByCartId(userCartId);
      const ticketPreview = await ticketService.stockCartProductsForTicket(userCartId);
      return res.render('ticket', { user, cartProducts,ticketPreview });
    }catch (err) {
      res.status(500).json({ Error: `${err}` });
    };
  };

 //FIN LLAVE TicketSCONTROLLER     
};

export const ticketsController = new TicketsController();