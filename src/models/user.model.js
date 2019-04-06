const mongoose = require('mongoose');
const helper = require('../lib/helper');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true}
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    const User = this;
    if (this.isModified('password') || this.isNew) {
        helper.encryptPassword(User.password)
            .then(encrypted => {
                User.password = encrypted;
                next();
            })
            .catch(error => next(error))
    }
});

module.exports = mongoose.model('User', UserSchema);