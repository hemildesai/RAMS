import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
	title : ['required']
};

require("./user");

const Project = Bookshelf.Model.extend({
	tableName:'projects',
	hasTimeStams: true,

	intialize : function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

  user: function() {
    return this.belongsTo("User");
  }

});

export default Bookshelf.model("Project", Project);
