import jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
//--

dotenv.config(); // Carga variables de entorno del .env

export class Jwt{

  generateTokens(email) {          
    try {
      const accessToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, {
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
      return decodedToken;
    } catch (error) {
      return error;
    }

  }
}

export const jwtUtils = new Jwt();


