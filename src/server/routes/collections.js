import express from 'express';
import passport from 'passport';
import {postCollection, getCollections, getCollection, getResourcesForCollection, putCollection, deleteCollection, getPrivateCollections, removeResourceFromCollection, addResourceToCollection} from '../controllers/collection.js';

const router = express.Router();

router.use(passport.authenticate("jwt", {session: false}));

router.route('/')
  .get(getCollections)
  .post(postCollection);

router.route("/private")
  .get(getPrivateCollections);

router.route('/:id')
  .get(getCollection)
  .put(putCollection)
  .delete(deleteCollection);

router.route("/:id/remove")
  .post(removeResourceFromCollection);

router.route("/:id/add")
  .post(addResourceToCollection);

router.route("/:id/resources")
  .get(getResourcesForCollection);

module.exports = router;
