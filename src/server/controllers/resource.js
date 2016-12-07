import Resource from '../models/resource.js';

export function postResource(req, res) {
  new Resource({
    user_id: req.user.id,
    name: req.body.name,
    link: req.body.link,
    is_private: req.body.is_private,
    description: req.body.description
  })
  .save()
  .then(resource => {
    if(req.body.collection_id) {
      resource.collections().attach(req.body.collection_id);
    }
    res.status(200);
    res.json({success: true, resource});
  })
  .catch(err => {
    res.json({success: false, errors: err});
  });
}

export function getResources(req, res) {
  Resource
    .where({is_private: false})
    .fetchAll()
    .then(function(resources) {
      res.json({success: true, resources});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getResource(req, res) {
  Resource
    .query(qb  => {
      qb.where({id: req.params.id}).andWhere(function() {
        this.where({is_private: false}).orWhere({user_id: req.user.id});
      })
    })
    .fetch({require: true, withRelated: ["user"]})
    .then(function(resource) {
      res.json({success: true, resource});
    })
    .catch(Resource.NotFoundError, () => {
      res.json({success: false, errors: "You are not authorized to view this resource"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function putResource(req, res) {
  Resource
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .fetch({require: true})
    .then(function(resource) {
      resource
      .save({
        name: req.body.name || resource.attributes.name,
        link: req.body.link || resource.attributes.link,
        is_private: req.body.is_private || resource.attributes.is_private
      }, {patch: true})
      .then(resource => {
        res.json({success: true, resource});
      })
      .catch(err => {
        res.json({success: false, errors: err})
      });
    })
    .catch(Resource.NotFoundError, () => {
      res.json({success: false, errors: "Resource does not belong to you or does not exist"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function deleteResource(req, res) {
  Resource
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .destroy({require: true})
    .then(function(resource) {
      res.json({success: true, message: "Resource " + req.params.id + " destroyed"});
    })
    .catch(Resource.NoRowsDeletedError, () => {
      res.json({success: false, errors: {message: "No rows deleted"}});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getPrivateResources(req, res) {
  Resource
    .query(qb  => {
      qb
      .where({is_private: true})
      .andWhere({user_id: req.user.id})
    })
    .fetchAll({require: true})
    .then(function(resources) {
      res.json({success: true, resources});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}
