import { appForTests as app, expect, supertest } from './test.config.js'; // Asegúrate de importar tu aplicación desde test.config.js

const requester = supertest(app);

describe('Product Router Tests', () => {
  // Prueba para obtener todos los productos
  it('Debería obtener todos los productos con propiedad "_id"', (done) => {
    requester
      .get('/products') // No necesitas incluir la URL completa aquí, ya que ya se configura en supertest
      //.expect('Content-Type', /json/) // Añade esta línea para indicar que esperas una respuesta JSON
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // Verifica que cada objeto tenga la propiedad "_id"
          // res.body.forEach((product) => {
          //   expect(product).to.have.property('_id');
          // });
          console.log(res)
          done();
        }
      });
  });




// import { app, expect, chai, url } from './test.config.js';
//import { appForTests as app, expect, chai,supertest  } from './test.config.js';
//const url = `http://localhost:8080`;
// import chai from 'chai';
// import supertest from 'supertest';

// const expect = chai.expect;
// const requester = supertest('http://127.0.0.1:8080');

// //const expect = chai.expect;
// const url = supertest('http://127.0.0.1:8080');
// describe('Product Router Tests', () => {
//   // Prueba para obtener todos los productos
//   it('Debería obtener todos los productos con propiedad "_id"', (done) => {
//     chai
//     .request(app)
//     .get(`${url}/products`)
//     .end((err, res) => {
//       // Verifica que cada objeto tenga la propiedad "_id"
//         res.body.forEach((product) => {
//           expect(product).to.have.property('_id');
//         });
//         done();
//       });
//   });
  
  // Prueba para obtener un producto por su ID
  // it('Debería obtener un producto por su ID', (done) => {
  //   const productId = 'tu_id_de_prueba'; // Reemplaza con un ID válido de prueba
  //   chai
  //     .request(app)
  //     .get(`${url}/products/${productId}`)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.an('object');
  //       done();
  //     });
  // });

  // // Prueba para agregar un nuevo producto
  // it('Debería agregar un nuevo producto', (done) => {
  //   const newProduct = {
  //     // Define los datos de tu nuevo producto aquí
  //   };
  //   chai
  //     .request(app)
  //     .post(`${url}/products/new`)
  //     .send(newProduct)
  //     .end((err, res) => {
  //       expect(res).to.have.status(201);
  //       expect(res.body).to.be.an('object');
  //       done();
  //     });
  // });

  // Agrega más pruebas según tus necesidades

});
