import { userService } from '../services/userService.js';

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
        req.session.user = {
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            age: req.user.age,
            role: req.user.role,
            isAdmin: req.user.isAdmin,
            idCart: req.user.idCart
        };
        return userService.redirectPerfil(res);
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
        req.session.user = {
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            age: req.user.age,
            role: req.user.role,
            isAdmin: req.user.isAdmin,
            idCart: req.user.idCart
        };
        return userService.redirectPerfil(res);
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
    // async getUserById(req, res) {
    //     const uid = req.params.uid;
    //     try {          
    //       const user = await userService.getUserById(uid/*{ _id: uid }*/);
    //       user ? user :  (() => { throw new Error (`El Usuario de id ${uid} no se encontró.`) })();
    //       //return user;
    //       return res.json(user)
    //     } catch (err) {
    //         return res.status(500).json({ error: `Error al buscar Usuario id ${uid}` });            
    //     }
    //   };
    async getUserById(req, res) {
        const uid = req.params.uid;
        try {          
          const user =  userService.userByIdOrEmail(uid/*{ _id: uid }*/);
          //user ? user :  (() => { throw new Error (`El Usuario de id ${uid} no se encontró.`) })();
          //return user;
          return res.json(user)
        } catch (err) {
            return res.status(500).json({ error: `Error al buscar Usuario id ${uid}` });            
        }
      };

 //FIN LLAVE UsersController    
}

export const usersController = new UsersController();