var crypto = require('crypto');

function hashGenerator (string) {
    return crypto.createHash('md5').update(string.toLowerCase().trim()).digest("hex");
}

module.exports = { hashGenerator };