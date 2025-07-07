"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorHandlers = void 0;
const config_1 = require("./config");
const template400 = (0, config_1.getConfig)("errors:400");
const template500 = (0, config_1.getConfig)("errors:500");
const createErrorHandlers = (app) => {
    app.use((req, res) => {
        res.statusCode = 404;
        res.render(template400);
    });
    const handler = (error, req, res, next) => {
        console.log(error);
        if (res.headersSent) {
            return next(error);
        }
        try {
            res.statusCode = 500;
            res.render(template500, { error });
        }
        catch (newErr) {
            next(error);
        }
    };
    app.use(handler);
};
exports.createErrorHandlers = createErrorHandlers;
