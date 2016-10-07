import Collection from '../models/collection.js';

export function postCollection(req, res) {
  new Collection({
    user_id: req.user.id,
    title: req.body.title,
    is_private: req.body.is_private
  })
  .save()
  .then(collection => {
    res.status(200);
    res.json({success: true, collection});
  })
  .catch(err => {
    res.json({success: false, errors: err});
  });
}

export function getCollections(req, res) {
  Collection
    .where({is_private: false})
    .fetchAll()
    .then(function(collections) {
      res.json({success: true, collections});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getCollection(req, res) {
  Collection
    .query(qb  => {
      qb.where({id: req.params.id}).andWhere(function() {
        this.where({is_private: false}).orWhere({user_id: req.user.id});
      })
    })
    .fetch({require: true, withRelated: ["user"]})
    .then(function(collection) {
      res.json({success: true, collection});
    })
    .catch(Collection.NotFoundError, () => {
      res.json({success: false, errors: "You are not authorized to view this collection"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function putCollection(req, res) {
  Collection
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .fetch({require: true})
    .then(function(collection) {
      collection
      .save({
        title: req.body.title || collection.attributes.title,
        is_private: req.body.is_private || collection.attributes.is_private
      }, {patch: true})
      .then(collection => {
        res.json({success: true, collection});
      })
      .catch(err => {
        res.json({success: false, errors: err})
      });
    })
    .catch(Collection.NotFoundError, () => {
      res.json({success: false, errors: "Collection does not belong to you or does not exist"});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function deleteCollection(req, res) {
  Collection
    .query(qb  => {
      qb
      .where({id: req.params.id})
      .andWhere({user_id: req.user.id})
    })
    .destroy({require: true})
    .then(function(collection) {
      res.json({success: true, message: "Collection " + req.params.id + " destroyed"});
    })
    .catch(Collection.NoRowsDeletedError, () => {
      res.json({success: false, errors: {message: "No rows deleted"}});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function getPrivateCollections(req, res) {
  Collection
    .query(qb  => {
      qb
      .where({is_private: true})
      .andWhere({user_id: req.user.id})
    })
    .fetchAll({require: true})
    .then(function(collections) {
      res.json({success: true, collections});
    })
    .catch(function(err) {
      res.send({success: false, errors: err});
    });
}

export function removeResourceFromCollection(req, res) {
  Collection
    .where({id: req.params.id, user_id: req.user.id})
    .fetch({require: true, withRelated: ["resources"]})
    .then(function (collection) {
      collection.resources().detach(req.body.resource_id)
        .then(function () {
          res.json({success: true, message: 'removed resource from collection'})
        })
        .catch(function (err) {
          res.json({success: false, error: "Could not remove resource from collection"});
        });
    })
    .catch(Collection.NotFoundError, function () {
      res.json({success: false, message: 'collection does not belong to you'})
    })
    .catch(function (err) {
      res.json({success: false, error: "Could not remove resource from collection"});
    });
}

export function addResourceToCollection(req, res) {
  Collection
    .where({id: req.params.id, user_id: req.user.id})
    .fetch({require: true, withRelated: ["resources"]})
    .then(function (collection) {
      collection.resources().attach(req.body.resource_id)
        .then(function () {
          res.json({success: true, message: 'added resource to collection'})
        })
        .catch(function (err) {
          res.json({success: false, error: "Could not remove resource from collection"});
        });
    })
    .catch(Collection.NotFoundError, function () {
      res.json({success: false, message: 'collection does not belong to you'})
    })
    .catch(function (err) {
      res.json({success: false, error: "Could not remove resource from collection"});
    });
}
