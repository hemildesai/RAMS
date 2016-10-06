import express from 'express';
import {authenticateUser} from '../controllers/authentication.js';

const router = express.Router();

router.route('/')
  .post(authenticateUser);

module.exports = router;
