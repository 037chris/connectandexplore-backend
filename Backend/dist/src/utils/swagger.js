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
                ICategory: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        description: {
                            type: "string",
                        },
                    },
                },
                IChat: {
                    type: "object",
                    properties: {
                    // Define IChat properties
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
                            type: "date",
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
                        isActive: {
                            type: "boolean",
                        },
                    },
                },
                IEvent: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        creator: {
                            $ref: "#/components/schemas/IUser", // Reference to IUser schema
                        },
                        description: {
                            type: "string",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                        },
                        address: {
                            $ref: "#/components/schemas/IAddress",
                        },
                        thumbnail: {
                            type: "string",
                        },
                        hashtags: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                        category: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/ICategory",
                            },
                        },
                        chat: {
                            $ref: "#/components/schemas/IChat", // Reference to IChat schema
                        },
                        participants: {
                            type: "array",
                            items: {
                                type: "string", // Assuming participants are represented by strings (e.g., ObjectId as strings)
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