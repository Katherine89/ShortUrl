import express from 'express';
import { ShortUrlRouter } from './routers/short-url-router.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('web'));
app.use(express.json());
app.use(ShortUrlRouter);

app.listen(port, () => console.log('listening on port ' + port));