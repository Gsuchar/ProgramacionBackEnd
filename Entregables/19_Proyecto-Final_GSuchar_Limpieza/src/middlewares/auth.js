import { jwtUtils } from "../utils/jwt.js";
import { userService } from "../services/userService.js";
//--

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

export function tokenValid(req, res, next) {
  const  userToken  = req.params.token
  const decodedToken = jwtUtils.decodeTokens(userToken)
  
  //- TO DO - -> Validar que el token sea del usuario, lo engancho por el mail. Tambien que el user.token no sea null o vacio


  //console.log("MIDLEWAREEE>>> " + JSON.stringify(decodedToken))
  decodedToken && decodedToken?.email ? next() : res.status(403).render('error', { error: 'El link expiro, solicite nuevamente el mail de recuperacion.' });
  // Si decodedToken existe y es valido, en caso de ser invalido no contine .email, pasa...si no renderiza error
}

//-----ENTREGA 18 -------------------------------------------------------------------------------
// Verifica los documentos del usuario antes de cambiar a isPremium
export async function checkUserDocuments (req, res, next) {
  try {
    const userId = req.params.uid;
    const userData = await userService.getUserByIdOrEmail(userId, null);

    // Verifica si el usuario tiene los documentos solicitados, si le falta alguno muestro error
    const hasAllDocuments =
      userData &&
      userData.documents &&
      // userData.documents.length === 3 &&
      userData.documents.some((doc) => doc.name === 'identification') &&
      userData.documents.some((doc) => doc.name === 'addressProof') &&
      userData.documents.some((doc) => doc.name === 'bankStatement');
    
    if (!hasAllDocuments) {
      return res.status(403).json({ error: 'El usuario debe cargar todos documentos antes de cambiar a Premium.' });
      //return res.status(403).render('error', { error: 'El usuario debe cargar todos documentos antes de cambiar a Premium.' });
    }
    //console.log("MIDLEWAREEE isPremium>>> " + JSON.stringify(userData.documents))

    // Si cargo todos los documentos, permite continuar 
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Error al verificar los documentos del usuario.' });
  }
};