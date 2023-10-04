import express from 'express';
import passport from 'passport';
import { tokenValid, isLoged,checkUserDocuments, isAdmin } from '../middlewares/auth.js';
import { usersController } from '../controllers/userController.js';
import  uploader  from "../utils/multer.js";

const authRouter = express.Router();

// Register
authRouter.get('/auth/register', usersController.register);
authRouter.post('/auth/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), usersController.registerPassport);
authRouter.get('/auth/failregister', usersController.registerFail);

// Login
authRouter.get('/auth/login', usersController.login);
authRouter.post('/auth/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), usersController.loginPassport);
authRouter.get('/auth/faillogin', usersController.loginFail);

// Logout
authRouter.get('/auth/logout', isLoged, usersController.logOut);

// Perfil de Usuario
authRouter.get('/auth/perfil', isLoged, usersController.perfil);
// Panel de Administración (accesible solo para usuarios con rol de admin e isAdmin = true)
// authRouter.get('/auth/administracion', isLoged, isAdmin, usersController.adminPanel);

// Dashboard
authRouter.get('/dashboard', isLoged, usersController.dashboard);

// Entrega 15 - 3er Practica integradora endpoint cambio premium en usuario
authRouter.get('/api/users/premium/:uid', /*isLoged,*/checkUserDocuments, usersController.changingUserPremium);

//-----ENTREGA 15 -------------------------------------------------------------------------------
// Ruta solicitando email donde enviar correo de recuperacion de contraseña
authRouter.get('/auth/recoveryPassword', usersController.recoveryPassword);
// Luego de obtener mail, envia correo de recuperacion de contraseña
authRouter.post('/auth/recoveryPassword', usersController.sendPasswordResetEmail);

// Ruta donde ingresara la nueva contraseña
authRouter.get('/auth/changePassword/:token', tokenValid,  usersController.processResetPassword);
// Luego que rellena el campo contraseña a restablecer
authRouter.post('/auth/changePassword/:token', tokenValid,  usersController.resetPassword);

//-----ENTREGA 18 -------------------------------------------------------------------------------

// Ruta para subir documentos o imágenes 
authRouter.post('/api/users/:uid/documents', isLoged, uploader.fields([
    { name: 'identification', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'profiles', maxCount: 1 }
  ]), usersController.uploadUserDocuments);

authRouter.get('/users', usersController.getUsers);
authRouter.get('/usersDTO', usersController.getUsersWithDTO);
authRouter.delete('/deleteInactiveUsers', usersController.deleteInactiveUsers);
//authRouter.delete('/users/:uid', usersController.deleteUser);

// Users
authRouter.get('/userList', isLoged, isAdmin, usersController.userList);

export default authRouter;