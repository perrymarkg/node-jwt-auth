const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const config = require('../config/in-memory-db');
const jwt = require('jsonwebtoken');
const boom = require('boom');

const _this = {
    validateUser: (username, password) => {
        //
        return new Promise((resolve, reject) => {
            _this.findUserBy(username)
            .then(user => _this.validatePassword(user, password))
            .then(user => resolve(user))
            .catch(error => reject(error));
        });
    },
    validatePassword: (user, rawpassword) => {
        //
        return new Promise((resolve, reject) => {
            if (!(user instanceof User)) {
                reject(boom.unauthorized('User not found'));
            }

            if (!rawpassword) {
                reject(boom.unauthorized('Invalid password'));
            }
            
            bcrypt.compare(rawpassword, user.password)
                .then(result => {
                    
                    if (!result) {
                        reject(boom.unauthorized('Invalid Password'));
                    }

                    resolve(user)
                })
                .catch(error => reject(error));
        });
    },
    findUserBy: (value, field = 'username') => {
        //
        const search = {};
        search[field] = value;

        return new Promise((resolve, reject) => {
            User.findOne(search)
            .exec()
            .then(result => {
                //
                if (result === null) {
                    reject(boom.unauthorized('User not found'));
                } else {
                    resolve(result);
                }
            })
            .catch(error => reject(boom.unauthorized(error)));
        });
    },
    createUser: (email, username, password) => {
        //
        return new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            username: username,
            password: password
        });
    },
    saveUser: (email, username, password) => {
        //
        return new Promise((resolve, reject) => {
            _this.createUser(email, username,password)
            .save()
            .then(result => resolve(result))
            .catch(error => reject(error));
        });
    },
    handleMongoError: (e) => {
        if (e && e.name === 'MongoError' && e.code === 11000) {
            return boom.forbidden('Username/Email already exists!');
        } else { 
            return boom.forbidden(e.message);
        }
    },
    issueCredentials: (user) => {
        
        const userPayload = {
            _id: user._id,
            username: user.username
        }

        return {
            token: jwt.sign(userPayload, config.secret)
        }
        
    }
}

module.exports = _this;