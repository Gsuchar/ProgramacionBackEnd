class ChatsController {
    async chats(req, res) {  
        try {      
          res.status(200).render('chat', { });
        }catch (err) {
          res.status(500).json({ Error: `${err}` });
        };
    };

 //FIN LLAVE CHATSCONTROLLER     
};

export const chatsController = new ChatsController();