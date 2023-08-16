import express from 'express';
import passport from 'passport';
import { isAdmin, isLoged } from '../middlewares/auth.js';
import { usersController } from '../controllers/userController.js';

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

//TESTING
// authRouter.get('/users', usersController.getUsers);
// authRouter.get('/users/:uid', usersController.getUserById);
// authRouter.delete('/users/:uid', usersController.deleteUser);

export default authRouter;