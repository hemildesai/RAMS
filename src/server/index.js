import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';

import db from '../db';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if(process.env.NODE_ENV == "development") {
  app.use(morgan('dev'));
}

app.use(compression());
app.use(passport.initialize());

import jwt_auth from './lib/jwt_auth.js';
jwt_auth(passport);

const port = process.env.PORT || 3000;

import routes from "./routes";
routes(app);

app.listen(port, () => {
  console.log("app listening on port " + port);
});

export default app;
