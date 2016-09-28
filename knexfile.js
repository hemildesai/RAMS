// Update with your config settings.
require("dotenv").config();

module.exports = {

	development: {
		client: "mysql",
		connection: {
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_DEVELOPMENT_USER,
			password: process.env.MYSQL_DEVELOPMENT_PASSWORD,
			database: process.env.MYSQL_DEVELOPMENT_DATABASE
		},
		migrations: {
			directory: "src/db/migrations"
		},
		seeds: {
			directory: "src/seeds/development"
		}
	},

	test: {
		client: "mysql",
		connection: {
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_TEST_USER
				,
			password: process.env.MYSQL_TEST_PASSWORD,
			database: process.env.MYSQL_TEST_DATABASE
		},
		migrations: {
			directory: "src/db/migrations"
		},
		seeds: {
			directory: "src/seeds/test"
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}

};
