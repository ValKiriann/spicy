const request = require('request');
var db = require('./db');
var parseString = require('xml2js').parseString;
var https = require('https');

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
      parseString(xml, function(err, result) {
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

    getAmerica: function(properties) {
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
                    //let db = new DB();
                    //db.onDB();
                    
                    for(var i= 0;i<games.length;i++){
                    
                        var title = games[i].title
                        db.saveGame(games[i], title, "america")
                        console.log("Adding [AME]" + title);
                        americaTotalGames++;
                    }
                    console.log("he terminado de añadir estos " + americaTotalGames)
                    control.offset += control.limit;
                    console.log(control.offset)
                    nintendo.getAmerica();
                }else {console.log("End of the History....");
                console.log("Total Games:", americaTotalGames)}
                
            }
        })
    },
    
    getEurope: function() {
        //url antigua con gamecard = http://search.nintendo-europe.com/en/select?fq=type%3AGAME%20AND%20(system_type%3A%22nintendoswitch_gamecard%22%20OR%20system_type%3A%22nintendoswitch_downloadsoftware%22%20OR%20system_type%3A%22nintendoswitch_digitaldistribution%22)%20AND%20product_code_txt%3A*&q=*&rows=1000&sort=sorting_title%20asc&start=0&wt=json
        request(`http://search.nintendo-europe.com/en/select?fq=type%3AGAME%20AND%20(system_type%3A%22nintendoswitch_downloadsoftware%22%20OR%20system_type%3A%22nintendoswitch_digitaldistribution%22)%20AND%20product_code_txt%3A*&q=*&rows=1000&sort=sorting_title%20asc&start=0&wt=json`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                let info = JSON.parse(body);
                let region = "europe"
                let games = info.response.docs
                for (var i = 0; i<games.length;i++){
                    let title = games[i].title
                    db.saveGame(games[i], title,region)
                    console.log("Adding [EUR]" + title)
                    europeTotalGames++;
                }
                console.log("I have added " + europeTotalGames)
            }
        })
    },
    getAsia: function() {
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
                var gameCode = games[i].InitialCode[0]
                gameCode = gameCode.replace("HAC", "");
                gameCode = gameCode.slice(0, -1);
                db.saveGameAsia(games[i], gameCode, "asia")
                //console.log("Adding [JPN]" + gameCode)
                asiaTotalGames++;
            }
            
            console.log("I have added " + asiaTotalGames)
          
        })
    }
}



module.exports = nintendo