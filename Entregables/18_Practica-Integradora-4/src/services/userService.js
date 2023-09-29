
import { userDAO } from '../DAO/userDAO.js';
import {CartService} from '../services/cartService.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { jwtUtils } from "../utils/jwt.js";
//--

const cartService = new CartService;
//const userDAO = new userDAO;

export class UserService {
  //------ AUTH USER
  
  async dashboard(req,res) {        
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      role: req.user.role,
      isPremium: req.user.isPremium,
      idCart: req.user.idCart
  }; 
    return res.redirect('/dashboard')  
  };

  
  

  //------ AUTH USER FIN ----------------

  // TRAIGO TODOS LOS USUARIOS
  async getUsers(limit) {          
    try {
        const users = await userDAO.getUsers(limit);
        return users;
    } catch (err) {           
        throw err;
    }
  };

  // USER NUEVO
  async addUser(newUser) {
      try {        
          const users = await this.getUsers();      
          const userExist = users.some((user) => user.email == newUser.email);
          if (userExist) {
              throw ("Ya existe el Usuario que desea ingresar.");
          };
            //Creo Carrito
            const cartId = await cartService.addCart()
            //Armo datos Usuario
            const userToCreate = {
              email: newUser.email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(newUser.email) ? newUser.email : (() => { throw ("Debe ingresar un Email válido.") })(),
              firstName: newUser.firstName ? newUser.firstName : (() => { throw ("Debe ingresar Nombre.") })(), 
              lastName: newUser.lastName ? newUser.lastName : (() => { throw ("Debe ingresar Apellido.") })(), 
              age: newUser.age ? newUser.age : '999', 
              isPremium: false,
              role: 'user',
              password: createHash( newUser.password),
              isPremium: false ,
              idCart: cartId._id
            };
            let createdUser = await userDAO.addUser(userToCreate);
          return createdUser;
      }catch (err) {
          throw (`Error al agregar Usuario. ${err}`);
      };    
  };

  // MODIFICA UN USUARIO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
  async updateUser(id, fieldsToUpdate) {
    try {            
      const userToUpdate = { ...fieldsToUpdate };           
      // Recorre los posibles campos, asigna los campos enviados si cumplen la validacion, si no manda mensaje con error
      for (const field in fieldsToUpdate) {
          switch (field) {
            case "email":
              userToUpdate.email = fieldsToUpdate.email !== "" ? fieldsToUpdate.email : (() => { throw ("Debe ingresar un email.") })();
            break;
            case "firstName":
              userToUpdate.firstName = fieldsToUpdate.firstName !== "" ? fieldsToUpdate.firstName : (() => { throw ("Debe ingresar Nombre.") })();
            break;
            case "lastName":
              userToUpdate.lastName = fieldsToUpdate.lastName !== "" ? fieldsToUpdate.lastName : (() => { throw ("Debe ingresar Apellido.") })();
            break;
            case "age":
              userToUpdate.age = fieldsToUpdate.age !== "" ? fieldsToUpdate.age : (() => { throw ("Debe ingresar su Edad(Cantidad de años).") })();
            break;
            case "role":
              userToUpdate.role = fieldsToUpdate.role !== "" ? fieldsToUpdate.role : "";
            break;
            case "isPremium":
              userToUpdate.isPremium = fieldsToUpdate.isPremium !== "" ? fieldsToUpdate.isPremium : "";
            break;
            case "token":
              userToUpdate.token = fieldsToUpdate.token !== "" ? fieldsToUpdate.token : (() => { throw ("Error al actualizar token.") })();
            break;
            case "password":
              userToUpdate.password = fieldsToUpdate.password !== "" ? fieldsToUpdate.password : (() => { throw ("Error al actualizar token.") })();
            break;
            case "last_connection":
              userToUpdate.last_connection = fieldsToUpdate.last_connection !== "" ? fieldsToUpdate.last_connection : (() => { throw ("Error al actualizar last_connection.") })();
            break;
            case "documents":
              userToUpdate.documents = fieldsToUpdate.documents !== "" ? fieldsToUpdate.documents : (() => { throw ("Error al actualizar documents.") })();
            break;
            default:
            break;
          }
        };            
      const userUpdated = await userDAO.updateUser( { _id: id }, userToUpdate );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };

  // DELETE USUARIO
  async deleteUser(user) {
    try {
        const idcartU = await this.getUserByIdOrEmail(user, null) 
        const deletedUser = await userDAO.deleteUser( user );          
        const cartIdUser = await cartService.getCartById( idcartU.idCart);
        await cartService.deleteCart(cartIdUser);
        return deletedUser;      
    }catch (err) {
        throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };

  async getUserByIdOrEmail(id, email) {
    try {
      const users = await userDAO.getUsers();
      let _id, _email;
      if (id) {
        // Busco user por id
        _id = users.find((user) => user._id.toString() === id.toString());
        // Si el id no es falsy y distinto de undefined lo retorna, si no manda null para activar activar throw error en controller
        _id && _id!=undefined ? _id : _id = null;
        return _id
      } else if (email) {
        // Busco user por email
        _email = users.find((user) => user.email.toString() === email.toString());
        // Si el email no es falsy y distinto de undefined lo manda, si no manda null para activar throw error en controller
        _email && _email!=undefined  ? _email :  null;
        return _email
      }      
    } catch (err) {
      throw (`Fallo al buscar Usuario. ${err}`);
    }

  };

  //---------- ENTREGA 15 ------------------------------
  async generatePasswordResetToken(email) {
    try {
      const user = await this.getUserByIdOrEmail(null, email);
      if (user) {
        // Verificar si el usuario ya tiene un token existente y si está vencido
        const existingToken = user.token;
        if (!existingToken || existingToken.trim() === '') {
          // Generar un nuevo token si no existe o está vacío
          const token = jwtUtils.generateTokens({ email, type: 'passwordReset' });
           // Gurdo token en usuario
          user.token = token;
          await user.save();
          return token;
        } else {
          try {
            const decodedToken = jwtUtils.decodeTokens(existingToken);
            if (decodedToken instanceof Error) {
              // Si falla decodificacion de token, genera uno nuevo
              const token = jwtUtils.generateTokens({ email, type: 'passwordReset' });
               // Gurdo token en usuario
              user.token = token;
              await user.save();
              return token;

              // Si existe el token, compruebo si expiro, en caso que si, genera un nuevo token.
            } else if (Date.now() >= decodedToken.exp * 1000) {// Hay que pasarlo a milisegundos si o si              
              const token = jwtUtils.generateTokens({ email, type: 'passwordReset' });
              // Gurdo token en usuario
              user.token = token;
              await user.save();
              return token;
            } else {

              // - TO DO - -> Si el token es valido, no mandar mail nuevamente y renderizar message con el mensaje 


              // Devuelve el token existente valido
              return existingToken;
            }
          } catch (error) {
            // Si hay error al decodificar el token, genera uno nuevo.
            const token = jwtUtils.generateTokens({ email, type: 'passwordReset' });
            // Almacena el token en el usuario en la base de datos
            user.token = token;
            await user.save();
            return token;
          }
        }
      }
      // Retorno null por retornar algo en try mayor, la respuesta esta dentro del if y si falla algo tambien.
      return null;
    } catch (err) {
      throw err;
    }
  }
  
  async processResetPassword (req, res){
    try {
      const  userToken  = req.params.token
      return res.render('changePassword', { userToken });

    } catch (error) {
      return error
    }
  }

  async resetPassword (req, res){
    try {
      const userToken  = req.params.token
      const decodedToken = jwtUtils.decodeTokens(userToken)
      const newPassword = req.body.password
      const user = await this.getUserByIdOrEmail(null, decodedToken?.email?.email)
      if (user && user?.token == userToken && user?.email == decodedToken?.email?.email ) {

        const currentPasswordHash = user.password;
        const isPasswordMatch = isValidPassword(newPassword, currentPasswordHash);  
        if (isPasswordMatch) {
          // El nuevo password es igual al anterior, muestro error
          return res.status(400).render('error', { error: 'El nuevo password debe ser diferente al anterior'});
        }
        await this.updateUser(user._id, {password: createHash( newPassword ), token: null })
        return res.redirect('/auth/login');
      }

    } catch (error) {
      return error
    }
  }

  login(req, res) {        
    return res.render('login', {});
  }

  //-----ENTREGA 18 -------------------------------------------------------------------------------
  async uploadUserDocuments(userId, documents) {
    try {
      const user = await this.getUserByIdOrEmail(userId, null); 
      // Si el usuario no tiene documentos existentes, inicializa como un array vacío
      !user.documents ? user.documents = [] : '' ;  
      // Itera sobre los documentos proporcionados, agrega o actualiza en el array de documentos del usuario
      for (const documentType in documents) {
        if (documents[documentType].length > 0) {
          const newDocuments = documents[documentType].map((document) => ({
            name: document.fieldname,
            reference: document.path,
          }));  
          // Itera sobre los nuevos documentos y verifica si ya existe un documento con el mismo name
          for (const newDocument of newDocuments) {
            const existingIndex = user.documents.findIndex((doc) => doc.name === newDocument.name);
            // Si existe un documento con el mismo nombre, lo actualizo. Si no, lo agrego.
            existingIndex !== -1 ? user.documents[existingIndex] = newDocument :   user.documents.push(newDocument);
          }
        }
      };  
      // Actualizo el usuario en la base de datos
      return await this.updateUser(userId, { documents: user.documents });
    } catch (err) {
      throw err;
    }
  };
  
  

  //-----

  //LLAVE FIN USER SERVICE
};

export const userService = new UserService();