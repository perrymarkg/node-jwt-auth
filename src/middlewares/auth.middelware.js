const { check } = require('express-validator/check');
const handlers = require('../../routes/auth/handlers');
const boom = require('boom')

exports.auth = [
    check('username').exists(),
    check('password').isLength({ min: 5 }).withMessage("Must be 5 characters long"),
    handlers.validationHandler(req, res, next)
];