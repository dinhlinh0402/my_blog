var bcrypt = require('bcrypt');
const { has } = require('config');
var config = require('config');

function hash_password(password){
    var saltRounds = config.get('salt');

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_password (password, hash) {
    // console.log(password, hash);
    return bcrypt.compareSync(password, hash);
}

module.exports = { hash_password, compare_password };