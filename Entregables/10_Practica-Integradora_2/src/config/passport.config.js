import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { UserModel } from '../dao/models/userModel.js';
import { UserService } from "../services/userService.js";
//import { CartService } from "../services/cartService.js";
import GitHubStrategy from 'passport-github2';
import dotenv from "dotenv";
//---
const userService = new UserService;
//const cartService = new CartService;
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {        
        const users = await userService.getUsers();
        let user;
        users.map((u) => u.email == username ?   user = u : '');
        //console.log("USER>>>>>>>>> "+user)
        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        //console.log('LO QUE LLEGA PASS>> '+password+ "USER.PASS>>>"+ user.password)
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age, password} = req.body;
          let newUser = {
            email,
            firstName,
            lastName,            
            age,
            password,
          };
          let userCreated = await userService.addUser(newUser);
          //console.log(userCreated);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (err) {
          console.log('Error in register' + e);
          //console.log(e);
          return done(e);
        }
      }
    )
  );
  dotenv.config(); // Carga variables de entorno del .env
  passport.use(
    'github',
    new GitHubStrategy(
      
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
      },
      async (accesToken, _, profile, done) => {     
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);
          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;
          console.log(profile)
          const users = await userService.getUsers();
          let user;
          users.map((u) => u.email == profile.email ?   user = u : '');
          console.log(user)
          if (!user) {
            let newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',            
              age: 18,
              password: 'nopass',
            };
            let userCreated = await userService.addUser(newUser);
            //console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            //console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          //console.log(e);
          return done(e);
        }
      }
    )
  );
  

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
