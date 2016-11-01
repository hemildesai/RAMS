import express from 'express';
import passport from 'passport';
import {postResource, getResources, getResource, putResource, deleteResource, getPrivateResources} from '../controllers/resource.js';

const router = express.Router();

router.use(passport.authenticate("jwt", {session: false}));

router.route('/')
  .get(getResources)
  .post(postResource);

router.route("/private")
  .get(getPrivateResources);

router.route('/:id')
  .get(getResource)
  .put(putResource)
  .delete(deleteResource);

module.exports = router;
