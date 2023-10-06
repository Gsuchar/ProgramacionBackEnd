// PARA EJECUTAR -> npx mocha test/authRoutes.test.js

import chai from 'chai';
import supertest from 'supertest';
import dotenv from "dotenv";
//--

dotenv.config(); // Carga variables de entorno del .env

const expect = chai.expect;
const requester = supertest(process.env.APP_URL); 

describe('Testing Auth Routes', () => {
  // Pruebas para el registro
  it('En endpoint POST /auth/register debería registrar un usuario correctamente y redireccionar a dashboard.', async () => {
    const user = {
      firstName: 'NombreTEST',
      lastName: 'ApellidoTEST',
      email: 'correoTEST@ejemplo.com',
      password: 'contraseñaTEST',
    };

    const response = await requester
      .post('/auth/register')
      .send(user);
    //console.log("RESPUESTA DEL SERVIDOR 1 >>>>  " + JSON.stringify(response))
    
    expect(response.status).to.equal(302);
    expect(response.text).to.equal('Found. Redirecting to /dashboard');
  });


  // Pruebas para el inicio de sesión
  it('En endpoint POST /auth/login debería iniciar sesión correctamente y redireccionar a dashboard.', async () => {
    const user = {
      email: 'correoTEST@ejemplo.com', 
      password: 'contraseñaTEST',
    };

    const response = await requester
      .post('/auth/login')
      .send(user);
      //console.log("RESPUESTA DEL SERVIDOR 2 >>>>  " + JSON.stringify(response));

      expect(response.status).to.equal(302);
      expect(response.text).to.equal('Found. Redirecting to /dashboard');
  });

  it('En endpoint GET /api/users/premium/:uid cambia isPremium en el user de true a false y viceversa', async () => {
    const userId = '64f67742108036a7562cb413'; // Tiene que existir en la base si no falla
    const response = await requester.get(`/api/users/premium/${userId}`);
    const { status, ok, body } = response;
    //console.log("RESPUESTA DEL SERVIDOR 3 >>>>  " + JSON.stringify(response));

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('object').that.has.property('_id').equal('64f67742108036a7562cb413'); // Tiene que existir en la base si no falla
    expect(body).to.be.an('object').that.has.property('isPremium');

  });

});