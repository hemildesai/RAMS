import config from '../../knexfile';
var env = process.env.NODE_ENV || "development";

export default require('knex')(config[env])
