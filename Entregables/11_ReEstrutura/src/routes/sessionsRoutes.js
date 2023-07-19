import { Router } from 'express';
import passport from 'passport';
//---

export const routerSessions = Router();

routerSessions.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

routerSessions.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect perfil.
  res.redirect('/auth/perfil');
});

routerSessions.get('/api/sessions/current', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

export default routerSessions;