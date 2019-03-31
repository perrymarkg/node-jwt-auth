const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true}
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    var User = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(User.password, salt))
        .then(hash => {
            User.password = hash;
            next();
        }).catch(error => next(error));
    }
});

module.exports = mongoose.model('User', UserSchema);