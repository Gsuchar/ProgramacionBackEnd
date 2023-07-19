import { UserModel, UserModel_2 } from '../dao/models/userModel.js';
import {CartService} from '../services/cartService.js';
import { createHash, isValidPassword } from '../utils.js';
import express from 'express';
import passport from 'passport';
const cartService = new CartService;
const userModel_2 = new UserModel_2;
export class UserService {
  //------ AUTH USER
  async register(res) {        
    return res.render('register', {});     
  };
  registerFail(res){
    return res.json({ error: 'fail to register' });
  };

  //--- POR AHORA REDICCIONO AL PERFIL CUANDO LOGUEA o REGISTRA, SEA POR PASSPORT O LOGIN MIO
  redirectPerfil(res){
    return res.redirect('/auth/perfil') 
  };


  loginFail(res){
    return res.json({ error: 'fail to login' });
  };
 
  
  // POR AHORA NO LO USO YA QUE LO MANDABA AL MISMO LUGAR, UNIFIQUE EN redirectPerfil
  // registerPassport(res){
  //   return res.redirect('/auth/perfil') 
  // };

  // login(res){
  //   return res.redirect('/auth/perfil') 
  // };
  

  //------ AUTH USER FIN ----------------

  // TRAIGO TODOS LOS USUARIOS
  async getUsers(limit) {          
    try {
        const users = await userModel_2.getUsers(limit);
        return users;
    } catch (err) {           
        throw err;
    }
  };

  // // TRAIGO USER SEGÚN EL ID
  // async getUserById(id) {
  //     try {
  //       const user = await UserModel.find({ _id: id });
  //       user ? user :  (() => { throw (`El Usuario de id ${id} no se encontró.`) })();
  //       return user;
  //     } catch (err) {
  //         throw (`Error al buscar Usuario id ${id}. ${err}`);            
  //     }
  // };
    // TRAIGO USER SEGÚN EL ID
  // async getUserById(id) {
  //   try {
  //     const user = await userModel_2.getUserById({ _id: id });
  //     //user ? user :  (() => { throw (`El Usuario de id ${id} no se encontró.`) })();
  //     return user;
  //   } catch (err) {
  //       throw (`SERVICE___Error al buscar Usuario id ${id}. ${err}`);            
  //   }
  // };
  // services/userService.js
async getUserById(id) {
  const user = await userModel_2.getUserById({ _id: id });
  return user;
}



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
            //let createdUser = await UserModel.create(userToCreate);
            let createdUser = await userModel_2.addUser(userToCreate);
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
      // const userUpdated = await UserModel.findByIdAndUpdate(
      //     { _id: id },
      //     userToUpdate,
      //     { new: true } // Esto asegura que se devuelva el documento actualizado (Mongo)
      //   );
      const userUpdated = await userModel_2.updateUser( { _id: id }, userToUpdate );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };

  // DELETE USUARIO
  // async deleteUser(id, cartId) {
  //     try {        
  //         const deletedUser = await UserModel.findByIdAndDelete({ _id: id });
  //         await cartService.deleteCart(cartId);
  //         return deletedUser;      
  //     }catch (err) {
  //         throw (`Fallo al borrar el Usuario. ${err}`);
  //     };
  // };
  async deleteUser(id, cartId) {
      try {        
          const deletedUser = await userModel_2.deleteUser({ _id: id });
          await cartService.deleteCart(cartId);
          return deletedUser;      
      }catch (err) {
          throw (`Fallo al borrar el Usuario. ${err}`);
      };
  };

  userByIdOrEmail(id, email){
    const users = this.getUsers();
    for (const param in users) {
      switch (param) {
        case "id":
          //const userById = users.some((user) => user._id == id);
          let userById;
          users.map((u) => u._id == users._id ?   userById = u : '');
          console.log(userById)
        return userById;
        case "email":
          //const userByEmail = users.some((user) => user.email == email);
          let userByEmail;
          users.map((u) => u.email == users.email ?   userByEmail = u : '');
          console.log(userByEmail)
                      
        return userByEmail;
      }
    };       
  };
  
  //LLAVE FIN USER SERVICE
};

export const userService = new UserService();