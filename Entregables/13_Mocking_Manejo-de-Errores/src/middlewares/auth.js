
export function isLoged(req, res, next) {
  req.session?.user?.email ? next() : res.status(401).render('error', { error: 'Debes estar logueado para acceder a este sitio.' });
}

export function isUser(req, res, next) {
  req.session?.user?.role == 'user' ? next() : res.status(401).render('error', { error: 'Error de Autorización!, solo permitido para usuarios comunes.' });
}

export function isAdmin(req, res, next) {
  req.session?.user?.role == 'admin'  ?  next() : res.status(403).render('error', { error: 'Error de Autorización!, no ADMIN' });;
}
