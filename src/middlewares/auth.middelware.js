const { check } = require('express-validator/check');
const controller = require('../controllers/users.controller');
const boom = require('boom')

exports.auth = [
    check('username').exists(),
    check('password').isLength({ min: 5 }).withMessage("Must be 5 characters long"),
    controller.validationHandler(req, res, next)
];