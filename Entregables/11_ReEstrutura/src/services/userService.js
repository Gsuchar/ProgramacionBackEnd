
import { UserModel, UserModel_2 } from '../DAO/mongo/models/userModel.js';
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
  // async redirectDashboard(res){
  //   return res.render('/dashboard') 
  // };

  loginFail(res){
    return res.json({ error: 'fail to login' });
  };
  async dashboard(req,res) {        
    //return res.render('dashboard', user);
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
    //let user = req.session.user;    
    //return res.render('dashboard', {user : req.session.user}); 
    return res.redirect('/dashboard')  
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
      const userUpdated = await userModel_2.updateUser( { _id: id }, userToUpdate );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };
  async getUserByIdOrEmail(id, email) {
    try {
      const users = await userModel_2.getUsers();
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
        // Si el id no es falsy y distinto de undefined lo manda, si no manda null para activar throw error en controller
        _email && _email!=undefined  ? _email :  null;
        return _email
      }      
    } catch (err) {
      throw (`Fallo al buscar Usuario. ${err}`);
    }

  };
  // DELETE USUARIO
  //async deleteUser(id, cartId) {
  async deleteUser(user) {
      try {
          console.log("LALA>11>> " + user) 
          const idcartU = await this.getUserByIdOrEmail(user, null) 
          console.log("LALA>>> " + idcartU)       
          const deletedUser = await userModel_2.deleteUser( user );
          
          const cartIdUser = await cartService.getCartById( idcartU.idCart);
          await cartService.deleteCart(cartIdUser);
          return deletedUser;      
      }catch (err) {
          throw (`Fallo al borrar el Usuario. ${err}`);
      };
  };

  
  
  //LLAVE FIN USER SERVICE
};

export const userService = new UserService();