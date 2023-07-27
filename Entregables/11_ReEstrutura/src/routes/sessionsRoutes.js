import { Router } from 'express';
import passport from 'passport';
import { usersController } from '../controllers/userController.js';
import { sessionsController } from '../controllers/sessionController.js';

//---

export const sessionRoutes = Router();

sessionRoutes.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionRoutes.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionsController.dashboard);
// sessionRoutes.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//   req.session.user = req.user;
//   // Successful authentication, redirect perfil.
//   res.redirect('/dashboard');
// });
//sessionRoutes.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), usersController.perfil);
// sessionRoutes.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//   req.session.user = req.user;
//   // Successful authentication, redirect perfil.
//   res.redirect('/auth/perfil');
// });

sessionRoutes.get('/api/sessions/current', sessionsController.currentSession);
// sessionRoutes.get('/api/sessions/current', (req, res) => {
//   return res.send(JSON.stringify(req.session));
// });

export default sessionRoutes;