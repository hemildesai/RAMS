import express from 'express';
import passport from 'passport';
import {changeUserPassword, postUser} from '../controllers/user.js';

const router = express.Router();

router.route('/')
  .post(postUser);

router.route("/change")
  .post(passport.authenticate("jwt", {session: false}), changeUserPassword);

module.exports = router;
