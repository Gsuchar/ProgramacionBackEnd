import { userService } from '../services/userService.js';
import { transport } from '../utils/nodemailer.js';
import { UserDTO } from "../DAO/DTO/userDTO.js";
//--

class UsersController {
    // REGISTER
    register(req, res) {
        return res.render('register', {}); 
    };

    // REGISTER FAIL
    registerFail(req, res) {
        return res.render('error', { error: 'Error al registrarse, verifique que los datos sean correctos.'  });
    };

    // REGISTER PASSPORT
    registerPassport(req, res) {            
        if (!req.user) {
            return res.json({ error: 'No existe usuario' });
        };
        // Guarda conexion al crear cuenta porque redirecciona a dashboard
         userService.updateUser(req.user._id, { last_connection: new Date() });
        return userService.dashboard(req, res);
    };

    // LOGIN
    login(req, res) {
        return res.render('login', {});
    };

    // LOGIN PASSPORT
    loginPassport(req, res) {
        if (!req.user) {
            return res.json({ error: 'Error en Credenciales' });
        };
        // Guarda ultima conexion al logear
        userService.updateUser(req.user._id, { last_connection: new Date() });
        return userService.dashboard(req, res);
    };

    // LOGIN FAIL
    loginFail(req, res) {
        return res.render('error', { error: 'Error al ingresar, verifique que los datos sean correctos.' });
    };

    // LOG OUT
    logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).render('error', { error: 'No se pudo cerrar su sesión' });
            };
            return res.redirect('/auth/login');
        });
    };

    // DASHBOARD
    dashboard(req, res) {
        const user = req.session.user;
        return res.render('dashboard', { user: user });        
    };


    // PERFIL USUARIO
    perfil(req, res) {
        const user = req.session.user;
        return res.render('perfil', { user: user });
    };


    //---- Entrega 19 - Proyecto Final
    async getUsers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const users = await userService.getUsers(limit);
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios.' });
        }
    };
    // DEJO OPCION DEL GET CON DTO DE USERS
    async getUsersWithDTO(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const users = await userService.getUsers(limit);    
            // Aplica el DTO a cada usuario
            const usersDTO = users.map(user => new UserDTO(user));    
            return res.json(usersDTO);
        } catch (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios.' });
        }
    };    

    // Extra
    async getUserById(req, res) {
        const uid = req.params.uid;
        try {         
          const user =  await userService.getUserByIdOrEmail(uid, null);
          //Si user es null(falsy), dispara mensaje de error que complementa el del catch
          user ? user :  (() => { throw (`El Usuario de id ${uid} no existe en la base de datos.`) })();
          return res.json(user)
        } catch (err) {
            return res.status(500).json({ Error: `No se encontró Usuario. ${err}` });             
        }
    };

    async deleteUser(req, res) {
        const uid = req.params.uid;
        try {         
          const user =  await userService.deleteUser(uid);
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
            return res.status(200).json(userPremiumChanged)
        } catch (err) {
            return res.status(500).json({ error: 'Error modificar usuarios.' });
        }
    };
        
//---ENTREGA 15 ------------------------------
    // Vista de solicitud de restablecimiento de contraseña
    recoveryPassword(req, res) {
        return res.render('recoveryPassword', {});
    }
    
    async sendPasswordResetEmail(req, res) {
        // Deberia pasarlo a service ???? -TO DO-
        try {
        const email = req.body?.email;
        // Generar un token de restablecimiento de contraseña con una duración de 15 min
        const token = await userService.generatePasswordResetToken(email);
        if (token) {
            const link = `${process.env.APP_URL}/auth/changePassword/${token}`;
            const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="${link}">Click Aqui</a></p>`,
            };

              // - TO DO - -> Si el token es valido, no mandar mail nuevamente y renderizar message con el mensaje 

              
            await transport.sendMail(mailOptions);
            return res.render('message', { title: 'Revisa tu correo :)',  message: 'Se ha enviado un correo de recuperación de contraseña.' });
        } else {
            return res.status(401).render('error', { error: 'Email ingresado no es valido o no existe en la base de datos.' });
        }
        } catch (err) {
            return res.status(500).json(err);
            //return res.status(500).render('error', { error: 'Error al enviar el correo de recuperación de contraseña.' });
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
    };

    //-----ENTREGA 18 -------------------------------------------------------------------------------
    async uploadUserDocuments(req, res) {
        try {
            const documents = req.files
            const userId = req.params.uid; // Obtiene el ID de usuario  
            await userService.uploadUserDocuments(userId, documents)
            return res.render('message', { title: 'Documentos Actualizados :)',  message: 'Se ha actualizado tu documentacion correctamente.' });

        } catch (error) {
            return res.status(500).render('error', { error: 'Error al subir documentos.' });

        }
    };
    
    // PF
    async deleteInactiveUsers(req, res) {
        try {
            const deletedUsers = await userService.deleteInactiveUsers();
            return res.json(deletedUsers);
        } catch (err) {
            return res.status(500).json({ error: `Error al eliminar usuarios inactivos: ${err}` });
        }
    }
    
   async  userList(req, res) {
        try {
            const user = req.session.user;
            const usersList = await userService.getUsers();
            return res.status(200).render('userList', { users: usersList, user });            
        } catch (error) {
            return res.status(500).render('error', { error: 'Error al listar usuarios.' });         
        }        
    };

 //FIN LLAVE USERCONTROLLER   
}

export const usersController = new UsersController();