const JWT = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");
const { JWT_SECRET } = require("../environments/Application");
const HTTP_STATUS = require("../utils/HttpStatus");

const isAuthenticatedUser = (...roles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new HttpError("Unauthorized", HTTP_STATUS.UNAUTHORIZED));
        }

        const token = authHeader.split(" ")[1];

        JWT.verify(token, JWT_SECRET, (err, user) => {
            if (err || !user) {
                return next(new HttpError("Unauthorized", HTTP_STATUS.UNAUTHORIZED));
            }

            if (roles.length && !roles.includes(user.role)) {
                return next(new HttpError("Forbidden", HTTP_STATUS.FORBIDDEN));
            }

            req.user = user;
            next();
        });
    };
};

module.exports = isAuthenticatedUser;
