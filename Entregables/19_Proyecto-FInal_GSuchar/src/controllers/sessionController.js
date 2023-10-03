//@ts-check
import { UserDTO } from "../DAO/DTO/userDTO.js";
import { userService } from '../services/userService.js';
//--

class SessionsController {
    currentSession(req, res) {
      const user = new UserDTO(req.session.user)
      return res.send(JSON.stringify(user));

    }

     dashboard(req, res) {
      req.session.user = req.user;
      // Guarda conexion al crear cuenta y redireccionar a dashboard
      userService.updateUser(req.user._id, { last_connection: new Date() });
      // Logueado va al dashboard.
      return res.redirect('/dashboard');
    }
    
 //FIN LLAVE CHATSCONTROLLER     
};

export const sessionsController = new SessionsController();