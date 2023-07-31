//@ts-check
class SessionsController {
    currentSession(req, res) {
      return res.send(JSON.stringify(req.session));
    }
     dashboard(req, res) {
      req.session.user = req.user;
      // Successful authentication, redirect perfil.
      return res.redirect('/dashboard');
    }
 //FIN LLAVE CHATSCONTROLLER     
};

export const sessionsController = new SessionsController();