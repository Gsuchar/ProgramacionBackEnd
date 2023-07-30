import { Router } from 'express';
import { chatsController } from '../controllers/chatController.js';
import { isLoged, isUser } from '../middlewares/auth.js';


const routerChat = Router();

routerChat.get("/chat", isLoged, isUser, chatsController.chats);

export default routerChat;