import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
  name: ['required']
};

require('./user');
require("./collection");

const Organization = Bookshelf.Model.extend({
  tableName: "organizations",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  },

  collections: function() {
    return this.hasMany("Team");
  }

  collections: function() {
    return this.hasMany("User");
  }
});

export default Bookshelf.model("Organization", Organization);

