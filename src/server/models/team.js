import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
  name: ['required']
};

require('./user');
// require("./collection");

const Team = Bookshelf.Model.extend({
  tableName: "teams",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  },

  organization: function() {
    return this.belongsTo("Organization");
  },

  users: function() {
    return this.hasMany("User");
  }

});

export default Bookshelf.model("Team", Team);

