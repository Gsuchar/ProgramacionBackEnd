//@ts-check
class SessionsController {
    currentSession(req, res) {
        return res.send(JSON.stringify(req.session));
      }

 //FIN LLAVE CHATSCONTROLLER     
};

export const sessionsController = new SessionsController();