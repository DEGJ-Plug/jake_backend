const YAML = require('yamljs');
const swaggerDocument = require('../utils/swaggerDocs');

// Load individual path files and merge them into the main document
const users = YAML.load('./docs/users/users.yaml');
const register = YAML.load('./docs/auth/register.yml');

swaggerDocument.paths = {
  ...swaggerDocument.paths,
  ...users,
  ...register,
};

module.exports = swaggerDocument;
