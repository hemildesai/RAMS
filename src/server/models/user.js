import Bookshelf from '../../bookshelf';
import Promise from 'bluebird';
import checkit from 'checkit';

const bcrypt = Promise.promisifyAll(require('bcrypt'));

var rules = {
  username: 'required',
  password: ['required', 'minLength:5']
};

// require('./resource');
// require('./collection');
// require('./team');
// require('./organization');

const User = Bookshelf.Model.extend({
  tableName: "users",
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.validateSave);
    this.on('saving', this.hashPassword);
  },

  validateSave: function() {
    return checkit(rules).run(this.attributes);
  },

  hashPassword: function() {
    return bcrypt.hashAsync(this.attributes.password, 10)
      .then(hash  => {
        this.set('password', hash);
      });
  }//,
  //
  // resources: function() {
  //   return this.hasMany("Resource");
  // },
  //
  // collections: function() {
  //   return this.hasMany("Collection");
  // },
  //
  // team: function() {
  //   return this.belongsTo("Team");
  // }

}, {
  verifyUser: Promise.method(function (username, password) {
    if (!username || !password) throw new Error("Username and Password are both required");

    return new this({username}).fetch({require: true}).tap(function(user) {
      return bcrypt.compareAsync(password, user.get('password'))
              .then(data => {
                if(!data) throw new Error("Invalid password");
              })
              .catch(err => {throw err;});
    });
  })
});

export default Bookshelf.model('User', User);

