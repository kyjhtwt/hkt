const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MTM's Node Express API with Swagger",
        version: "0.1.0",
        description: "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        }
      },
      host: 'localhost:8080/',
      basePath: '/',
      servers: [
        {
          url: "http://localhost:8080",
        },
      ],
    },
    apis: ["./router/*.js",  "./swagger/*"] ,
  };
  
  const specs = swaggerJsdoc(options);

  module.exports = {
      swaggerUi,
      specs
  };