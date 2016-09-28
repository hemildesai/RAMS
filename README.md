# ResourceManagementApp
A web application to store and organize online resources shared within an organization

Follow the steps to setup the environment on your local machine - 
* Install the necessary prerequisites including - 
  * Node.js
  * npm
  * git
  * MySQL
* After cloning the repo, run `npm install` at the root of the repo
* The environment variables for development should be stored in a .env file at the root of the repo (take a look at `knexfile.js` for the required environment variables)
* Create the necessary development and test databases in your local MySQL instance or else the database connection via `knex` will fail
* See `package.json` for scripts to run and test the API
