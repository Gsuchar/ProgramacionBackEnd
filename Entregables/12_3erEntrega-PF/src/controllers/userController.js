import { userService } from '../services/userService.js';
import { sessionsController } from '../controllers/sessionController.js';

class UsersController {
    // REGISTER
    register(req, res) {
        return userService.register(res);
    };
    // REGISTER FAIL
    registerFail(req, res) {
        return userService.registerFail(res);
    };
    // REGISTER PASSPORT
    registerPassport(req, res) {            
        if (!req.user) {
            return res.json({ error: 'No existe usuario' });
        };
        return userService.dashboard(req, res);
    };
    // LOGIN
    login(req, res) {
        return res.render('login', {});
    }
    // LOGIN PASSPORT
    loginPassport(req, res) {
        if (!req.user) {
            return res.json({ error: 'Error en Credenciales' });
        };
        return userService.dashboard(req, res);
    };
    // LOGIN FAIL
    loginFail(req, res) {
        return userService.loginFail(res);
    }
    // LOG OUT
    logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).render('error', { error: 'No se pudo cerrar su sesión' });
            };
            return res.redirect('/auth/login');
        });
    };

    dashboard(req, res) {
        const user = req.session.user;
        return res.render('dashboard', { user: user });
        
    };
    
    // PERFIL USUARIO
    perfil(req, res) {
        const user = req.session.user;
        return res.render('perfil', { user: user });
    };
    // PERFIL ADMINISTRADOR
    adminPanel(req, res) {
        return res.send('Si ves esto es que sos ADMIN, PROXIMAMENTE PANEL DE ADMIN.');
    };

    //---- TESTING

    // getUsers(){
    //     return userService.getUsers();
    // }
    async getUsers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const users = await userService.getUsers(limit);
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios.' });
        }
    }

    async getUserById(req, res) {
        const uid = req.params.uid;
        try {         
          console.log(uid)   
          const user =  await userService.getUserByIdOrEmail(uid, null);
          //Si user es null(falsy), dispara mensaje de error que complementa el del catch
          user ? user :  (() => { throw (`El Usuario de id ${uid} no existe en la base de datos.`) })();
          //return user;
          console.log("CON_CONTROLL>  " + user)
          return res.json(user)
        } catch (err) {
            //return res.status(500).json({ Error: `Error al buscar Usuario id ${uid}. ${err}` });
            return res.status(500).json({ Error: `No se encontró Usuario. ${err}` });             
        }
      };
    async deleteUser(req, res) {
        const uid = req.params.uid;
        try {         
          console.log(uid)   
          const user =  await userService.deleteUser(uid);
          console.log("CON_TROLL>  " + user)
          return res.json(user)
        } catch (err) {
            //return res.status(500).json({ Error: `Error al buscar Usuario id ${uid}. ${err}` });
            return res.status(500).json({ Error: `No se encontró Usuario. ${err}` });             
        }
      };

 //FIN LLAVE UsersController    
}

export const usersController = new UsersController();