var crypto = require('crypto');

function hashGenerator (string) {
    var title = string.toLowerCase();
    title = title.trim();
    return crypto.createHash('md5').update(title).digest("hex");
}

function igamecodeGenerator(gamecode) {
    if(gamecode.length > 3) {
        var char = gamecode.length
        var start = char -1 ;
        var finish = start - 4;
        var international_gamecode = gamecode.substring(start, finish);
        return international_gamecode;
    } else { return false }
}

module.exports = { hashGenerator, igamecodeGenerator };