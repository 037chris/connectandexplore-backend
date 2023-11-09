// Copyrights Code: https://github.com/TomDoesTech/REST-API-Tutorial-Updated/blob/main/src/utils/swagger.ts

import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Explore and Connect REST API Docs",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        IAddress: {
          type: "object",
          properties: {
            street: {
              type: "string",
            },
            houseNumber: {
              type: "string",
            },
            apartmentNumber: {
              type: "string",
            },
            postalCode: {
              type: "string",
            },
            city: {
              type: "string",
            },
            stateOrRegion: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
        },
        IUser: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            name: {
              type: "object",
              properties: {
                first: {
                  type: "string",
                },
                last: {
                  type: "string",
                },
              },
            },
            password: {
              type: "string",
            },
            isAdministrator: {
              type: "boolean",
            },
            address: {
              $ref: "#/components/schemas/IAddress",
            },
            profilePicture: {
              type: "string",
            },
            birthDate: {
              type: "string",
              format: "date",
            },
            gender: {
              type: "string",
            },
            socialMediaUrls: {
              type: "object",
              properties: {
                facebook: {
                  type: "string",
                },
                instagram: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/model/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use("/swagger/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at https://localhost:${port}/swagger/docs`);
}

export default swaggerDocs;
