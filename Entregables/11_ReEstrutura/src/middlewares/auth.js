export function isUser(req, res, next) {
  // if (req.session?.user?.email) {
  //   return next();
  // }
  // return res.status(401).render('error', { error: 'error de autenticacion!' });

  req.session?.user?.email ? next() : res.status(401).render('error', { error: 'error de autenticacion!' });
}

export function isAdmin(req, res, next) {
  //if (req.session?.user?.isAdmin) {
  // if (req.session?.user?.role == 'admin') {
  //   return next();
  // }
  req.session?.user?.role == 'admin'  ?  next() : res.status(403).render('error', { error: 'Error de Autorización!, no ADMIN' });;

  //return res.status(403).render('error', { error: 'Error de Autorización!, no ADMIN' });
}
