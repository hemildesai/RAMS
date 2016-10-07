import Project from '../models/project.js';

export function postProject(req, res) {
  new Project({
    user_id: req.user.id,
    title: req.body.title,
    is_private: req.body.is_private
  })
  .save()
  .then(project => {
    res.status(200);
    res.json({success: true, project});
  })
  .catch(err => {
    res.json({success: false, errors: err});
  });
}

export function getProjects(req, res) {
  Project
    .where({is_private: false})
    .fetchAll()
    .then(function(projects) {
      res.json({success: true, projects});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getProject(req, res) {
  Project
    .query(qb  => {
      qb.where({id: req.params.id}).andWhere(function() {
        this.where({is_private: false}).orWhere({user_id: req.user.id});
      })
    })
    .fetch({require: true, withRelated: ["user"]})
    .then(function(project) {
      res.json({success: true, project});
    })
    .catch(Project.NotFoundError, () => {
      res.json({success: false, errors: "You are not authorized to view this project"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function putProject(req, res) {
  Project
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .fetch({require: true})
    .then(function(project) {
      project
      .save({
        title: req.body.title || project.attributes.title,
        is_private: req.body.is_private || project.attributes.is_private
      }, {patch: true})
      .then(project => {
        res.json({success: true, project});
      })
      .catch(err => {
        res.json({success: false, errors: err})
      });
    })
    .catch(Project.NotFoundError, () => {
      res.json({success: false, errors: "Project does not belong to you or does not exist"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function deleteProject(req, res) {
  Project
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .destroy({require: true})
    .then(function(project) {
      res.json({success: true, message: "Project " + req.params.id + " destroyed"});
    })
    .catch(Project.NoRowsDeletedError, () => {
      res.json({success: false, errors: {message: "No rows deleted"}});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getPrivateProjects(req, res) {
  Project
    .query(qb  => {
      qb
      .where({is_private: true})
      .andWhere({user_id: req.user.id})
    })
    .fetchAll({require: true})
    .then(function(projects) {
      res.json({success: true, projects});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function removeResourceFromProject(req, res) {
  Project
    .where({id: req.params.id, user_id: req.user.id})
    .fetch({require: true, withRelated: ["resources"]})
    .then(function (project) {
      project.resources().detach(req.body.resource_id)
        .then(function () {
          res.json({success: true, message: 'removed resource from project'})
        })
        .catch(function (err) {
          res.json({success: false, error: "Could not remove resource from project"});
        });
    })
    .catch(Project.NotFoundError, function () {
      res.json({success: false, message: 'project does not belong to you'})
    })
    .catch(function (err) {
      res.json({success: false, error: "Could not remove resource from project"});
    });
}

export function addResourceToProject(req, res) {
  Project
    .where({id: req.params.id, user_id: req.user.id})
    .fetch({require: true, withRelated: ["resources"]})
    .then(function (project) {
      project.resources().attach(req.body.resource_id)
        .then(function () {
          res.json({success: true, message: 'added resource to project'})
        })
        .catch(function (err) {
          res.json({success: false, error: "Could not remove resource from project"});
        });
    })
    .catch(Project.NotFoundError, function () {
      res.json({success: false, message: 'project does not belong to you'})
    })
    .catch(function (err) {
      res.json({success: false, error: "Could not remove resource from project"});
    });
}
