import { Router } from 'express';
//import { chatManager } from "../dao/chatManager.js";
import { MessageModel } from "../dao/models/messageModel.js";

const routerChat = Router();
//const chatManager = new chatManager('../dao/dataFiles/chats.json');

routerChat.get("/chat", async (req, res) => {  
    try {
      //const products = await productManager.getProducts(); 
      res.status(200).render('chat', { });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
  });


export default routerChat;
