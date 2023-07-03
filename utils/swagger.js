const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Jake API',
      version: '1.0.0',

      description:
        'Jake backend APIs made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Jake',
        url: 'https://test.com',
        email: 'degjplug@gmail.com',
      },
    },
    servers: [
      {
        url: `${process.env.SITE_URL}:${process.env.PORT}`,
      },
    ],
  },
  apis: ['app.js', 'user/routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
module.exports = swaggerDocs;
