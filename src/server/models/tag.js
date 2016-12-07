import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

var rules = {
	title : ['required']
};

require("./resource");

const Tag = Bookshelf.Model.extend({
	tableName:'tags',
	hasTimeStams: false,

	intialize : function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		return checkit(rules).run(this.attributes);
	},

  resource: function() {
    return this.belongsTo("Resource");
  }

});

export default Bookshelf.model("Tag", Tag);
