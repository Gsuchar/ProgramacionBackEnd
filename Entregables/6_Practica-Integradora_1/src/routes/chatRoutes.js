import { Router } from 'express';
//import { chatManager } from "../dao/chatManager.js";

const routerChat = Router();

routerChat.get("/chat", async (req, res) => {  
    try {      
      res.status(200).render('chat', { });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
  });


export default routerChat;
