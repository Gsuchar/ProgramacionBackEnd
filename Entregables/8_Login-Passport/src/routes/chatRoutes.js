import { Router } from 'express';

const routerChat = Router();

routerChat.get("/chat", async (req, res) => {  
    try {      
      res.status(200).render('chat', { });
    } catch (err) {
        res.status(500).json({ Error: `${err}` });
    };
  });

export default routerChat;