import { userService } from '../services/userService.js';
import { transport } from '../utils/nodemailer.js';
//--

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
    // LOG OUT
    dashboard(req, res) {
        const user = req.session.user;
        return res.render('dashboard', { user: user });        
    };


    // PERFIL USUARIO
    perfil(req, res) {
        const user = req.session.user;
        return res.render('perfil', { user: user });
    };


    // Ya adelante algo...
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
          //console.log(uid)   
          const user =  await userService.getUserByIdOrEmail(uid, null);
          //Si user es null(falsy), dispara mensaje de error que complementa el del catch
          user ? user :  (() => { throw (`El Usuario de id ${uid} no existe en la base de datos.`) })();
          //console.log("CON_CONTROLL>  " + user)
          return res.json(user)
        } catch (err) {
            return res.status(500).json({ Error: `No se encontró Usuario. ${err}` });             
        }
    };

    async deleteUser(req, res) {
        const uid = req.params.uid;
        try {         
          //console.log(uid)   
          const user =  await userService.deleteUser(uid);
          //console.log("CON_TROLL>  " + user)
          return res.json(user)
        } catch (err) {
            return res.status(500).json({ Error: `No se encontró Usuario. ${err}` });             
        }
    };

    // Cambio estado de isPremium segun usuario
    async changingUserPremium(req, res) {
        try {
            const userId = req.params.uid;
            const userData = await userService.getUserByIdOrEmail(userId, null);
            // En caso de que el usuario tenga isPremium = true, lo pasa a false...y viceversa           
            const userPremiumChanged = userData?.isPremium ? await userService.updateUser(userId, {isPremium: false}) 
                : await userService.updateUser(userId, {isPremium: true});
            return res.json(userPremiumChanged)
        } catch (err) {
            return res.status(500).json({ error: 'Error modificar usuarios.' });
        }
    }
        
//---ENTREGA 15 ------------------------------
    // Mostrar vista de solicitud de restablecimiento de contraseña
    recoveryPassword(req, res) {
        return res.render('recoveryPassword', {});
    }

    // Agregar una función para enviar el correo de recuperación de contraseña
    async sendPasswordResetEmail(req, res) {
        // Deberia pasarlo a service ???? -TO DO-
        try {
        const { email } = req.body;
        // Generar un token de restablecimiento de contraseña con una duración de 1 hora
        const token = await userService.generatePasswordResetToken(email);
        if (token) {
            // Enviar el correo con el token y un enlace a la vista changePassRecovery
            const link = `${process.env.APP_URL}/auth/changePassword/${token}`;
            const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Recuperación de Contraseña',
            //html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="${link}">${link}</a></p>`,
            html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="${link}">Click Aqui</a></p>`,
            };
            await transport.sendMail(mailOptions);
            //return res.json({ message: 'Se ha enviado un correo de recuperación de contraseña.' });
            return res.render('message', { title: 'Revisa tu correo :)',  message: 'Se ha enviado un correo de recuperación de contraseña.' });
        } else {
            //return res.json({ error: 'No se pudo generar el token de recuperación de contraseña.' });
            return res.status(401).render('error', { error: 'Email ingresado no es valido o no existe en la base de datos.' });
        }
        } catch (err) {
        //return res.status(500).json({ error: 'Error al enviar el correo de recuperación de contraseña.' });
        return res.status(500).render('error', { error: 'Error al enviar el correo de recuperación de contraseña.' });
        }
    }
    async processResetPassword (req, res){
        try {
            return userService.processResetPassword(req, res) 
        } catch (err) {
            return res.status(500).json({ Error: `EEEEE. ${err}` });             
        }
    };
    
    async resetPassword(req, res) {
        try {
            return userService.resetPassword(req, res) 
        } catch (err) {
            return res.status(500).json({ Error: `AAAA. ${err}` });             
        }
        //return res.redirect('/auth/login');
    }


   
}

export const usersController = new UsersController();