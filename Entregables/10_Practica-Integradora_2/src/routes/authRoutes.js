import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.get('/auth/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

authRouter.get('/auth/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/auth/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' });
  }
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
  res.redirect('/auth/perfil') 
  //return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/auth/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' });
});

authRouter.get('/auth/login', (req, res) => {
  return res.render('login', {});
});

authRouter.post('/auth/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' });
  }
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
  //const user = req.session.user;
  //return res.json({ msg: 'ok', payload: req.user });
  //return res.render('perfil', { user: user });
  return res.redirect('/auth/perfil')
});

authRouter.get('/auth/faillogin', async (req, res) => {
  return res.json({ error: 'Error al ingresar.' });
});

authRouter.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'No se pudo cerrar su session' });
    }
    return res.redirect('/auth/login');
  });
});

authRouter.get('/auth/perfil', isUser, (req, res) => {
  const user = req.session.user;
  return res.render('perfil', { user: user });
});

authRouter.get('/auth/administracion', isUser, isAdmin, (req, res) => {
  return res.send('Si ves esto es que sos ADMIN, PROXIMAMENTE MENU DE ADMIN.');
});


export default authRouter;