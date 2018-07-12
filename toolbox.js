var crypto = require('crypto');

function hashGenerator (string) {
    var title = string.toLowerCase();
    title = title.trim();
    return crypto.createHash('md5').update(title).digest("hex");
}

function validGamecode(gamecode) {
    return typeof gamecode !== undefined && gamecode.length > 3;
}

//REFACTORIZAR NOMBrE A intGamecodeGen
function iGamecodeGenerator(gamecode) {
    var char = gamecode.length
    var start = char -1 ;
    var finish = start - 4;
    var international_gamecode = gamecode.substring(start, finish);
    return international_gamecode;
}

// De VERDAD ESTO ES NECESARIO?!""
//BORRAR
function regionCode (region) {
    return region + "_raw"
}

module.exports = { hashGenerator, iGamecodeGenerator, validGamecode, regionCode };