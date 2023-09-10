import swaggerJSDoc from 'swagger-jsdoc';
import { __dirname } from "../utils.js";

//--
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Programacion Backend - Gsuchar CODERHOUSE 2023 - ',
    version: '1.0.0',
    description: 'Documentacion de API',
  },
  servers: [
    {
      url: `${process.env.APP_URL}`, // Cambia esto según tu configuración
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  //apis: ['./routes/*.js'], // Ruta donde están tus archivos de rutas
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;