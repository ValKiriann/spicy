/** 
* This is the toolbox. Here we have the tools we need across all the platform. These functions prepare the data.
* @module toolbox 
* @exports module:toolbox.cleanTitle
* @exports module:toolbox.hashGenerator
* @exports module:toolbox.validGamecode
* @exports module:toolbox.iGamecodeGenerator
*/
var crypto = require('crypto');
/**
 * Returns the title cleaned and prepared for database
 * @module module:toolbox.cleanTitle
 * @param {string} title - Title of a game.
 * @returns {string} string cleaned
 */
function cleanTitle(title){
    title = title.toLowerCase();
    var re = /\W/g;
    return  title.replace(re, "");
}
/**
 * Returns a hashed string by md5
 * @requires module:crypto
 * @param {string} string - String to hash
 * @returns {string} 
 * @module module:toolbox.hasGenerator
 */
function hashGenerator (string) {
    return crypto.createHash('md5').update(string).digest("hex");
}
/**
 * Returns true or false depending is the gamecode is valid or not
 * @module module:toolbox.validGamecode
 * @param {string} gamecode - raw gamecode of the continent
 * @returns {boolean}
 */
function validGamecode(gamecode) {
    return typeof(gamecode) === "string" && gamecode.length > 3;
}
/**
 * Returns the 4 digit international gamecode
 * @module module:toolbox.iGamecodeGenerator
 * @param {string} gamecode - raw gamecode of the continent
 * @returns {string} The international gamecode
 */
function iGamecodeGenerator(gamecode) {
    var char = gamecode.length
    var start = char -1 ;
    var finish = start - 4;
    var intl_gamecode = gamecode.substring(start, finish);
    return intl_gamecode;
}

module.exports = { hashGenerator, iGamecodeGenerator, validGamecode, cleanTitle };