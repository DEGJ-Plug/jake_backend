const settings = {
  // openapi: '3.1.0',
  swagger: '2.0',
  info: {
    title: 'Jake API',
    description: 'API Docs',
    version: 1.0,
    contact: { email: 'degjplug@gmail.com' },
    liscence: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/liscences/LIS',
    },
    servers: {
      url: 'http://localhost:8090',
      description: 'This is my local Server',
    },
  },
  schemes: ['http', 'https'],
};

module.exports = settings;
