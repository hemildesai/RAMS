import express from 'express';
import passport from 'passport';
import {postProject, getProjects, getProject, getCollectionsForProjects, putProject, deleteProject, getPrivateProjects, removeCollectionFromProject, addCollectionToProject} from '../controllers/project.js';

const router = express.Router();

router.use(passport.authenticate("jwt", {session: false}));

router.route('/')
  .get(getProjects)
  .post(postProject);

router.route("/private")
  .get(getPrivateProjects);

router.route('/:id')
  .get(getProject)
  .put(putProject)
  .delete(deleteProject);

router.route("/:id/remove")
  .post(removeCollectionFromProject);

router.route("/:id/add")
  .post(addCollectionToProject);

router.route("/:id/collections")
  .get(getCollectionsForProjects);

module.exports = router;
