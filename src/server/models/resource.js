import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
  name: ['required', 'maxLength:20'],
  link: ["required"]
};

require('./user');

const Resource = Bookshelf.Model.extend({
  tableName: "resources",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  },

  user: function() {
    return this.belongsTo("User");
  }
});

export default Bookshelf.model("Resource", Resource);
