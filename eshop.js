const request = require('request');
var db = require('./db');
var xml2js = require('xml2js');

var parseString = require('xml2js').parseString;
var https = require('https');

var parser = new xml2js.Parser({explicitArray : false});

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
let americaTotalGames = 0;
let europeTotalGames = 0;
let asiaTotalGames = 0;

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
                //let region = "america"
                console.log("Current: " + url);
                if(info && info.games && info.games.game){
                    
                    let games = info.games.game
                    
                    for(var i= 0;i<games.length;i++){
                    
                        var title = games[i].title
                        var gamecode = games[i].game_code
                        db.saveGame(games[i], title, "usa", gamecode)
                        americaTotalGames++;
                    }
                    console.log("he terminado de añadir " + americaTotalGames)
                    control.offset += control.limit;
                    console.log(control.offset)
                    nintendo.getUsa();
                }else {console.log("End of the History....");
                console.log("Total Games:", americaTotalGames)}
                
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
                    console.log("Adding [EUR]" + title)
                    europeTotalGames++;
                }
                console.log("I have added " + europeTotalGames)
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
                asiaTotalGames++;
            }
            
            console.log("I have added " + asiaTotalGames)
          
        })
    }
}



/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Book(title, author) {
}


module.exports = nintendo