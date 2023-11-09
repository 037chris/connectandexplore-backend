"use strict";
// Copyrights Code: https://github.com/TomDoesTech/REST-API-Tutorial-Updated/blob/main/src/utils/swagger.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const package_json_1 = require("../../package.json");
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Explore and Connect REST API Docs",
            version: package_json_1.version,
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger page
    app.use("/swagger/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    console.log(`Docs available at https://localhost:${port}/swagger/docs`);
}
exports.default = swaggerDocs;
//# sourceMappingURL=swagger.js.map