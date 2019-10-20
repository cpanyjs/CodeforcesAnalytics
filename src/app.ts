import express from 'express';
import bodyParser from 'body-parser';

import { DEFAULT_HOST, DEFAULT_PORT } from './config';

import anyRouter from './analytics';

const app = express();

app.set('host', process.env.HOST ? process.env.HOST : DEFAULT_HOST);
app.set('port', process.env.PORT ? process.env.PORT : DEFAULT_PORT);

app.use(bodyParser.json());

app.use('/', anyRouter);

export default app;
