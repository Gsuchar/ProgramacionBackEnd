import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://127.0.0.1:8080'); 

describe('Testing Product Routes', () => {
  
  it('En endpoint GET /products debe obtener todos los productos', async () => {
    const response = await requester.get('/products');
    const { status, ok, body } = response;
    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('array');
  });

  it('En endpoint GET /products/:id debe obtener un producto por su ID', async () => {
    const productId = '64f67773108036a7562cb41d'; // Tiene que existir en la base si no falla
    const response = await requester.get(`/products/${productId}`);
    const { status, ok, body } = response;
    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(body).to.be.an('array');
  });

  it('En endpoint POST /products/new debe agregar un nuevo producto', async () => {
    const newProduct = {
      title: 'Producto de prueba',
      description: 'Descripción de prueba',
      code: 12345,
      price: 777,
      status: "true",
      stock: 10,
      category: 'Prueba',
      thumbnail: 'thumbnail.jpg',
      owner: 'admin',
    };
  
    const response = await requester.post('/products/new').send( {products: newProduct});
    const { status, ok, body } = response;
    console.log("RESPUESTA DEL SERVIDOR>>>>  " + JSON.stringify(response.body))
    expect(status).to.equal(201);
    expect(ok).to.be.true;
    expect(body.products).to.be.an('object').that.has.property('_id');

  });


});
