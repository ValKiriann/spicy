/** 
* This is the eshop module. Here we control the functions that make the conections to the apis of Nintendo divided by Continents.
* @module eshop
* @exports module:nintendo
*/
const request = require('request');
var db = require('./db');
var xml2js = require('xml2js');
const msg = require("./msg_conf")
var parseString = require('xml2js').parseString;
var https = require('https');
var parser = new xml2js.Parser({explicitArray : false});

/**
 * Default function for xml2js library
 * @function xmlToJson
 * @param {string} url - the url to prepare
 * @param {function} callback - The callback function to execute
 * @requires module:https
 * @requires module:xml2js.parseString
 */
function xmlToJson(url, callback) {
  var req = https.get(url, function(res) {
    var xml = '';
    
    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    }); 

    res.on('timeout', function(e) {
      callback(e, null);
    }); 

    res.on('end', function() {
      parser.parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}


let url = "";
let control = {
    limit: 200,
    offset: 0
}
let usaTotalGames = 0;
let eurTotalGames = 0;
let jpnTotalGames = 0;


var nintendo = {
    getUsa: function(properties) {
        if(properties){
            //quito shop=ncom para que guarde más
            url = `https://www.nintendo.com/json/content/get/filter/game?system=switch&limit=${properties.limit}&offset=${properties.offset}${properties.category}${properties.price}${properties.availability}${properties.sale}${properties.demo}`
        } else {
            url = `https://www.nintendo.com/json/content/get/filter/game?system=switch&limit=${control.limit}&offset=${control.offset}`
        }
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                let info = JSON.parse(body)
                let region = "usa"
                if(control.offset == 0){console.log("[" + region + "] " + msg.start("Starting the USA game check"))}
                console.log("[" + region + "] - Checking url: " + url);
                if(info && info.games && info.games.game){
                    
                    let games = info.games.game
                    
                    for(var i= 0;i<games.length;i++){
                    
                        var title = games[i].title
                        var gamecode = games[i].game_code
                        db.saveGame(games[i], title, "usa", gamecode)
                        usaTotalGames++;
                    }
                    console.log("[" + region + "] I successfully retrieved " + usaTotalGames + " games")
                    control.offset += control.limit;
                    nintendo.getUsa();
                }else {console.log("[" + region + "] End of the list of games to check - END");
                console.log("[" + region + "] Total Games checked:", usaTotalGames)}
                
            }
        })
    },
    
    getEur: function() {
        //url antigua con gamecard = http://search.nintendo-europe.com/en/select?fq=type%3AGAME%20AND%20(system_type%3A%22nintendoswitch_gamecard%22%20OR%20system_type%3A%22nintendoswitch_downloadsoftware%22%20OR%20system_type%3A%22nintendoswitch_digitaldistribution%22)%20AND%20product_code_txt%3A*&q=*&rows=1000&sort=sorting_title%20asc&start=0&wt=json
        request(`http://search.nintendo-europe.com/en/select?fq=type%3AGAME%20AND%20(system_type%3A%22nintendoswitch_downloadsoftware%22%20OR%20system_type%3A%22nintendoswitch_digitaldistribution%22)%20AND%20product_code_txt%3A*&q=*&rows=1000&sort=sorting_title%20asc&start=0&wt=json`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                let info = JSON.parse(body);
                let region = "eur"
                let games = info.response.docs
                for (var i = 0; i<games.length;i++){
                    let title = games[i].title
                    let gamecode = games[i].product_code_txt[0]
                    db.saveGame(games[i], title,region, gamecode)
                    //console.log("Adding [EUR]" + title)
                    eurTotalGames++;
                }
                console.log("I have added " + eurTotalGames)
            }
        })
    },
    getJpn: function() {
        var url = `https://www.nintendo.co.jp/data/software/xml/switch.xml`
        
        xmlToJson(url, function(err, data) {
            if (err) {
                // Handle this however you like
                return console.err(err);
            }
        
            let info = JSON.stringify(data, null, 2);
            info = JSON.parse(info);
            let games = info.TitleInfoList.TitleInfo
            
            for(let i = 0; i<games.length;i++){
                var gameCode = games[i].InitialCode
                var title = games[i].TitleName
                db.saveGame(games[i], title, "jpn", gameCode)
                jpnTotalGames++;
            }
            
            console.log("I have added " + jpnTotalGames)
          
        })
    }
}

module.exports = nintendo