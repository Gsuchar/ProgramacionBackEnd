import jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
//--

dotenv.config(); // Carga variables de entorno del .env
export class Jwt{
  //let expirationTime;
  //--
  //let expirationTime = '2m';
  //let expirationTime = process.env.EMAIL_TOKEN_EXPIRATION;

  generateTokens(email) {          
    try {
      const accessToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, {
        //expiresIn: process.env.EMAIL_TOKEN_EXPIRATION,
        expiresIn: '15m'
      });
      return accessToken;
    } catch (error) {
      return error
    }
  
  };
  decodeTokens(token) {          
    try {
      const decodedToken = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
      //console.log("JWT_DECODE>> " + JSON.stringify(decodedToken));
      return decodedToken;
    } catch (error) {
      //console.error("catch JWT.JS>>>>>>>>>>>>>>>>>> Error al decodificar el token: ", error);
      return error;
    }

  }
}

export const jwtUtils = new Jwt();


