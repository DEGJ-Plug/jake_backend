const YAML = require('yamljs');
const swaggerDocument = require('../utils/swaggerDocs');

// Load individual path files and merge them into the main document
const register = YAML.load('./docs/auth/register.yml');
const login = YAML.load('./docs/auth/login.yml');

swaggerDocument.paths = {
  ...swaggerDocument.paths,
  ...register,
  ...login,
};

module.exports = swaggerDocument;
