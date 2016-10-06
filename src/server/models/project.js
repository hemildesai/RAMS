import Bookshelf from '../../bookshelf';

var rules = {
	project_name : ['required']
};

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