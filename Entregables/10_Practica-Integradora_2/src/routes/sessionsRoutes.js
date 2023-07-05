import { Router } from 'express';
import passport from 'passport';
//---

export const routerSessions = Router();

routerSessions.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

routerSessions.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect home.
  res.redirect('/auth/perfil');
});

routerSessions.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

export default routerSessions;