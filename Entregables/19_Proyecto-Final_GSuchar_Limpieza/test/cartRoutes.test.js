// PARA EJECUTAR -> npx mocha test/cartRoutes.test.js

import chai from 'chai';
import supertest from 'supertest';
import dotenv from "dotenv";
//--

dotenv.config(); // Carga variables de entorno del .env

const expect = chai.expect;
const requester = supertest(process.env.APP_URL); 

describe('Testing Cart Routes', () => {
  
  it('En endpoint GET /carts debe obtener todos los carts', async () => {
    const response = await requester.get('/carts');
    const { status, ok, body } = response;

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('object');
  });

  it('En endpoint GET /carts/:cid debe obtener un cart por su ID', async () => {
    const cartId = '64f690167178ab1d5fca651b'; // Tiene que existir en la base si no falla
    const response = await requester.get(`/carts/${cartId}`);
    const { status, ok, body } = response;

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('object');
  });

  it('En endpoint PUT /carts/:cid/product/:pid debe agregar un producto al cart con quantity++ ', async () => {
    // Cartid y productid deben existir en la base, si no falla.
    const response = await requester.put('/carts/64f676ec108036a7562cb3f3/product/64f67773108036a7562cb41d');
    const { status, ok, body } = response;
    //console.log("RESPUESTA DEL SERVIDOR>>>>  " + JSON.stringify(response.body));

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('object').that.has.property('_id').equal('64f676ec108036a7562cb3f3'); // Verifica que devolvio el cart solicitado.
    expect(body.products[0]).to.be.an('object').that.has.property('quantity');

  });


});
