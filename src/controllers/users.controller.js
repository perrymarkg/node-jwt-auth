const UserService = require('../services/user.service');
const { validationResult } = require('express-validator/check');

const _this = {
    validationHandler: (req, res, next) => {
        const errors = validationResult(req);
        console.log('Errors', !errors.isEmpty());
        if (!errors.isEmpty()) {
            next(boom.badRequest(false, errors.array()))
        }
        next();
    },
    saveUser: (req, res, next) => {
        UserService
            .saveUser(req.body.email, req.body.username, req.body.password)
            .then(result => res.status(200).send(result))
            .catch(error => next(error));
    },
    index: (req, res) => {
        res.status(200).send('Welcome');
    }
}

module.exports = _this;
