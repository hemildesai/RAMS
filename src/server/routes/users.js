import express from 'express';
import {postUser} from '../controllers/user.js';

const router = express.Router();

router.route('/')
  .post(postUser);

module.exports = router;
