process.env.NODE_ENV = "test";
require("dotenv").config();

import chai from 'chai';
const {should, expect} = chai;
import chaiHTTP from 'chai-http';
import request from 'request';
import server from '../src/server';
import knex from '../src/db';

chai.use(chaiHTTP);

global.chai = chai;
global.request = request;
global.should = should();
global.server = server;
global.knex = knex;
global.expect = expect;
