import { UserModel } from '../dao/models/userModel.js';
import {CartService} from '../services/cartService.js';
import { createHash, isValidPassword } from '../utils.js';
const cartService = new CartService;

export class UserService {

    // TRAIGO TODOS LOS USUARIOS
    async getUsers(limit) {          
      try {
          const users = await UserModel.find().limit(limit);
          return users;
      } catch (err) {           
          throw (`Error al buscar usuario. ${err}`);
      }
  };

  // TRAIGO USER SEGÚN EL ID
  async getUserById(id) {
      try {
        const user = await UserModel.find({ _id: id });
        user ? user :  (() => { throw (`El Usuario de id ${id} no se encontró.`) })();
        return user;
      } catch (err) {
          throw (`Error al buscar Usuario id ${id}. ${err}`);            
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
              email: newUser.email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(newUser.email) ? newUser.email : (() => { throw ("Debe ingresar un Email válido.") })(),//Bajo por comodidad al leer
              firstName: newUser.firstName ? newUser.firstName : (() => { throw ("Debe ingresar Nombre.") })(), 
              lastName: newUser.lastName ? newUser.lastName : (() => { throw ("Debe ingresar Apellido.") })(), 
              age: newUser.age ? newUser.age : '999', 
              isAdmin: false,
              role: 'user',
              password: createHash( newUser.password),
              idCart: cartId._id
            };
            let createdUser = await UserModel.create(userToCreate);
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
              default:
                break;
            }
        };            
      const userUpdated = await UserModel.findByIdAndUpdate(
          { _id: id },
          userToUpdate,
          { new: true } // Esto asegura que se devuelva el documento actualizado (Mongo)
        );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };

  // DELETE USUARIO
  async deleteUser(id, cartId) {
      try {        
          const deletedUser = await UserModel.findByIdAndDelete({ _id: id });
          await cartService.deleteCart(cartId);
          return deletedUser;      
      }catch (err) {
          throw (`Fallo al borrar el Usuario. ${err}`);
      };
  };
  
  //LLAVE FIN USER SERVICE
};