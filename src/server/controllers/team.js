import Team from '../models/team.js';

export function postTeam(req, res) {
  new Team({
    organization_id: req.user.attributes.organization_id || req.body.organization_id,
    name: req.body.name,
  })
  .save()
  .then(team => {
    req.user.save({
      team_id: team.id,
      permissions: 1
    })
    .then(user => {
      res.status(200);
      res.json({success: true, team, user});
    });
    // .finally(() => {
    //   res.status(200);
    //   res.json({success: true, team});
    // });
  })
  .catch(err => {
    res.json({success: false, errors: err});
  });
}

export function getTeams(req, res) {
  Team
    .query(qb  => {
      qb.where({organization_id: req.user.attributes.organization_id});
    })
    .fetchAll()
    .then(function(teams) {
      res.json({success: true, teams});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getTeam(req, res) {
  Team
    .query(qb  => {
      qb.where({id: req.params.id}).andWhere(function() {
        this.where({id: req.user.attributes.team_id});
      })
    })
    .fetch({require: true, withRelated: ["users"]})
    .then(function(team) {
      res.json({success: true, team});
    })
    .catch(Team.NotFoundError, () => {
      res.json({success: false, errors: "You are not authorized to view this team"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function putTeam(req, res) {
  Team
    .query(qb  => {
      qb
      .where({id: req.params.id});
      // .andWhere({organization_id: req.organization.id})
    })
    .fetch({require: true})
    .then(function(team) {
      team
      .save({
        name: req.body.name || team.attributes.name
      }, {patch: true})
      .then(team => {
        res.json({success: true, team});
      })
      .catch(err => {
        res.json({success: false, errors: err})
      });
    })
    .catch(Team.NotFoundError, () => {
      res.json({success: false, errors: "Team does not belong to your organization or does not exist"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function deleteTeam(req, res) {
  Team
    .query(qb  => {
      qb
      .where({id: req.params.id});
      // .andWhere({organization_id: req.organization.id})
    })
    .destroy({require: true})
    .then(function(team) {
      res.json({success: true, message: "Team " + req.params.id + " destroyed"});
    })
    .catch(Team.NoRowsDeletedError, () => {
      res.json({success: false, errors: {message: "No rows deleted"}});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}
