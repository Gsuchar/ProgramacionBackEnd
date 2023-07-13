import express from 'express';
import { jugadoresRouter } from './routes/jugadores.router.js';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', jugadoresRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => {
  res.send('ruta no encontrada');
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
