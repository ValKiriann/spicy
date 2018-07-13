var crypto = require('crypto');

function cleanTitle(title){
    title = title.toLowerCase();
    var re = /\W/g;
    return  title.replace(re, "");
}


function hashGenerator (string) {
    return crypto.createHash('md5').update(string).digest("hex");
}

function validGamecode(gamecode) {
    return typeof(gamecode) === "string" && gamecode.length > 3;
}

//REFACTORIZAR NOMBrE A intGamecodeGen
function iGamecodeGenerator(gamecode) {
    var char = gamecode.length
    var start = char -1 ;
    var finish = start - 4;
    var intl_gamecode = gamecode.substring(start, finish);
    return intl_gamecode;
}

// De VERDAD ESTO ES NECESARIO?!""
//BORRAR
function regionCode (region) {
    return region + "_raw"
}

module.exports = { hashGenerator, iGamecodeGenerator, validGamecode, regionCode, cleanTitle };