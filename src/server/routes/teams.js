import express from 'express';
import passport from 'passport';
import {postTeam, getTeams, getTeam, putTeam, deleteTeam} from '../controllers/team.js';

const router = express.Router();

router.use(passport.authenticate("jwt", {session: false}));

function team_admin(req, res, next) {
  if(req.user.attributes.permissions > 0 && req.params.id == req.user.attributes.team_id) {
    next();
  } else {
    res.sendStatus(401);
  }
}

router.route('/')
  .get(getTeams)
  .post(postTeam);

router.route('/:id')
  .get(getTeam)
  .put(team_admin, putTeam)
  .delete(team_admin, deleteTeam);

// router.route("/:id/remove")
//   .post(removeCollectionFromTeam);
//
// router.route("/:id/add")
//   .post(addCollectionToTeam);

module.exports = router;
