// PARA EJECUTAR -> npx mocha test/productRoutes.test.js

import chai from 'chai';
import supertest from 'supertest';
import dotenv from "dotenv";
//--

dotenv.config(); // Carga variables de entorno del .env

const expect = chai.expect;
const requester = supertest(process.env.APP_URL); 

describe('Testing Product Routes', () => {
  
  it('En endpoint GET /products debe obtener todos los productos', async () => {
    const response = await requester.get('/products');
    const { status, ok, body } = response;

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('array').that.is.not.empty; // Verifica que body sea un array no vacío;
  });

  it('En endpoint GET /products/:pid debe obtener un producto por su ID', async () => {
    const productId = '64f6772b108036a7562cb40b'; // Tiene que existir en la base si no falla
    const response = await requester.get(`/products/${productId}`);
    const { status, ok, body } = response;

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('array').that.is.not.empty; // Verifica que body sea un array no vacío
    const product = body.find((item) => item._id === '64f6772b108036a7562cb40b');// Tiene que existir en la base si no falla
    expect(product).to.exist; // Verifica que devolvio el producto solicitado.

  });

  it('En endpoint POST /products/new debe agregar un nuevo producto', async () => {
    const newProduct = {
      title: 'Producto de TESTING',
      description: 'Descripción de TESTING',
      code: 12345,
      price: 777,
      status: "true",
      stock: 10,
      category: 'TESTING',
      thumbnail: 'thumbnail.jpg',
      owner: 'admin',
    };  
    const response = await requester.post('/products/new').send( {products: newProduct});
    const { status, ok, body } = response;
    //console.log("RESPUESTA DEL SERVIDOR>>>>  " + JSON.stringify(response.body))

    expect(status).to.equal(201);
    expect(ok).to.be.true;
    expect(body.products).to.be.an('object').that.has.property('_id');
    expect(body.products).to.have.property('title', 'Producto de TESTING'); // Verifica el título del producto recien creado.

  });

});
