const User = require('../schema/userSchema');
const bcrypt = require('bcryptjs');
const Crypto = require('crypto');
module.exports = {

    getUserById: (id, cb) => {
        User.findById(id, cb);
    },
    getUserByEmail: (email, cb) => {
        User.findOne({ email: email }, cb);
    },
    getByUsern: (username, cb) => {
        User.findOne({ username: username }, cb);
    },
    createUser: (newUser, cb) => {
        bcrypt.genSalt(10, function (err, salt) {
            //password with incrypted hash value
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) throw err;
                newUser.tokenHash = Crypto.randomBytes(32).toString('hex') + newUser.username;
                newUser.password = hash;
                newUser.save(cb);
            })
        })
    },
   
    comparePassword: (myPassword, hash, cb) => {
        bcrypt.compare(myPassword, hash, function (err, isMatch) {
            if (err) throw err;
            cb(null, isMatch)
        });
    },
    saveToken: function (newToken, cb) {
        newToken.save(cb);
    },
    getToken: (tokenHash, cb) => {
        User.findOne({ tokenHash: tokenHash }, cb);
    },

}