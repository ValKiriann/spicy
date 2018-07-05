var crypto = require('crypto');

function hashGenerator (string) {
    return crypto.createHash('md5').update(string).digest("hex");
}

module.exports = { hashGenerator };