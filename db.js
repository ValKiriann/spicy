const admin = require("firebase-admin");
const serviceAccount = require("./credentials/firebase-service-account.json");
var toolbox = require("./toolbox");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://spicy-switch.firebaseio.com/"
});

var database = admin.database();
/*
REPLACED BY A TOOLBOX FUNCTION INTERNATIONAL

function gameCodeGenerator (code) {
    return typeof(code) === "string" && code.length > 3 ? code.slice(4, 8) : false;
}
*/


// De VERDAD ESTO ES NECESARIO?!""
function regionCode (region) {
    return region.trim().toLowerCase() + "_raw"
}

function regionData (region, game) {
    //region = region.split("_raw")[0];
    var data = {};
    switch (region) {
        case "america":
            data.title = game.title
            data.title_raw = game.title.toLowerCase()
            data.america_gamecode = game.game_code
            data.international_gamecode = toolbox.igamecodeGenerator(game.game_code)
            data.categories = game.categories.category;
            break;
         case "asia":
            data.asia_gamecode = game.InitialCode
            data.international_gamecode = toolbox.igamecodeGenerator(game.InitialCode)
            data.title_asia = game.TitleName
            break;
        case "europe":
            data.europe_url = game.url;
            data.languages = game.language_availability[0].split(",");
            data.europe_gamecode = game.product_code_txt[0]
            data.international_gamecode = toolbox.igamecodeGenerator(game.product_code_txt[0])
            data.categories = game.game_categories_txt;
            data.title = game.title;
            data.title_raw = game.title.toLowerCase();
            data.release_date = new Date(game.date_from).getTime();
            break;
        default:
            console.log("No tenemos una logica específica para esta region tan rota...")
    }
    return data
}


var db = {
    saveGame: function (game, title, region){
        var hash = toolbox.hashGenerator(title);
        var regionName = regionCode(region)
        var ref = database.ref(`/games/${hash}`);
        var dataToStore = {
            last_verification: new Date().getTime(),
            [regionName]: game
        };
        
        ref.update(Object.assign(dataToStore, regionData(region, game)))
    },
    saveGameAsia: function(game, gameCode){
        var ref = database.ref(`/games/`);
        ref.orderByChild("international_gamecode").equalTo(gameCode).once("value").then(function(snapshot) {
            if (snapshot.val() !== null) {
                var gameRef = Object.keys(snapshot.val())[0];
                // EXPLICAME POR QUE SALE ESTE ERROR MAGICO DE TOLWERCASE OF UNDEFINED
                //console.log(gameRef.title_raw);
                var data = snapshot.val()[gameRef];
                var title = ""
                if(typeof data.title !== 'undefined') {
                    title = data.title
                }else {
                    title = game.TitleName
                }
                console.log("[JPN] -  Updating: " + title);
                db.saveGame(game, title, "asia");
                
                
                // PROBLEMA TM DE DARK SOULS
            } else {
                var title = game.TitleName
                console.log("[JPN] - New: " + title)
                db.saveGame(game, title, "asia");
            }
        });
    },
    cleanDB: function() {
        var ref = database.ref(`/`);
         ref.update({
            games: ""
        });
    }
}
module.exports = db