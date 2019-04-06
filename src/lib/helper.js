const bcrypt = require('bcrypt');
const config = require('../config/config');

module.exports = {
    encryptPassword: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(config.bcryptRounds)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => resolve(hash))
            .catch(error => reject(error));
        });
    }
}