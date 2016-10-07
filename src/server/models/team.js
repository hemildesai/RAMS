import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
  title: ['required']
  
};

require('./user');
require("./collection");

const Team = Bookshelf.Model.extend({
  tableName: "Team",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  }

});

export default Bookshelf.model("Team", Team);

