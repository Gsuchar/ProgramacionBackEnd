
export function isLoged(req, res, next) {
  req.session?.user?.email ? next() : res.status(401).render('error', { error: 'Debes estar logueado para acceder a este sitio.' });
}

export function isUser(req, res, next) {
  req.session?.user?.role == 'user' ? next() : res.status(401).render('error', { error: 'Error de Autorización!, solo permitido para usuarios comunes.' });
}

export function isAdmin(req, res, next) {
  req.session?.user?.role == 'admin'  ?  next() : res.status(403).render('error', { error: 'Error de Autorización!, no ADMIN' });;
}

export function isPremium(req, res, next) {
  req.session?.user?.isPremium == true || req.session?.user?.role == 'admin'  ?
    next() : res.status(403).render('error', { error: 'Error de Autorización!, no user Premium' });
}

import { jwtUtils } from "../utils/jwt.js";

export function tokenValid(req, res, next) {
  const  userToken  = req.params.token
  const decodedToken = jwtUtils.decodeTokens(userToken)
  //console.log("MIDLEWAREEE>>> " + JSON.stringify(decodedToken))
  decodedToken && decodedToken.email ? next() : res.status(403).render('error', { error: 'El link expiro, solicite nuevamente el mail de recuperacion.' });
  // Si decodedToken existe y es valido, en caso de ser invalido no contine .email, pasa...si no renderiza error
}

// export function tokenValid(req, res, next) {
//   const userToken = req.params.token;
//   const decodedToken = jwtUtils.decodeTokens(userToken);
//   //console.log("MIDLEWAREEE>>> " + JSON.stringify(decodedToken));
//   if (decodedToken && decodedToken.email) {
//     next(); // Token válido
//   } else {
//     res.status(403).render('error', { error: 'El link expiró o no es válido.' });
//   }
// }