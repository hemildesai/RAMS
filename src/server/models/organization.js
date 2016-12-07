import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
  name: ['required']
};

require('./user');
require("./team");

const Organization = Bookshelf.Model.extend({
  tableName: "organizations",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  },

  teams: function() {
    return this.hasMany("Team");
  },

  users: function() {
    return this.hasMany("User");
  }
});

export default Bookshelf.model("Organization", Organization);

