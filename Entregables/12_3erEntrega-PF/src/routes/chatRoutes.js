import { Router } from 'express';
import { chatsController } from '../controllers/chatController.js';


const routerChat = Router();

routerChat.get("/chat", chatsController.chats);

export default routerChat;