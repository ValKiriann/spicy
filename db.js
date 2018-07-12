const admin = require("firebase-admin");
const serviceAccount = require("./credentials/firebase-service-account.json");
var toolbox = require("./toolbox");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://spicy-switch.firebaseio.com/"
});

var database = admin.database();

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
    saveGame: function (game, title, region, gamecode){
        if(toolbox.validGamecode(gamecode)){
            // GAMECODE EXISTE LUEGO TENEMOS PATRON INTERNACIONAL
            var iGamecode = toolbox.iGamecodeGenerator(gamecode);
            var ref = database.ref(`/games/`);
            var regionName = region + "_raw";
            var dataToStore = {
                last_verification: new Date().getTime(),
                [regionName]: game
            };
            
            //pensar variable mas pequeña?
            // TODO refactorizar ref2
            ref.orderByChild("international_gamecode").equalTo(iGamecode).once("value").then(function(snapshot) {
                // COINCIDE LUEGO EXISTE
                if (snapshot.val() !== null) {
                    var gameRef = Object.keys(snapshot.val())[0];
                    var data = snapshot.val()[gameRef];
                    console.log("[" + region + "] -  Updating: " + title);
                    var ref2 = database.ref(`/games/${gameRef}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }else {
                    // NO COINCIDE LUEGO SE CREA
                    var hash = toolbox.hashGenerator(title);
                    var ref2 = database.ref(`/games/${hash}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }
            });
        }else {
            //TODAVIA SIN GAMECODE LUEGO NO TENEMOS PATRON INTERNACIONAL
            // PROBAMOS POR SI ENCONTRAMOS POR EL TITULO UN MATCH
            //TITLE RAW NEW EN UNA VAR
            ref.orderByChild("title_raw").equalTo(title_raw).once("value").then(function(snapshot) {
                // COINCIDE LUEGO EXISTE
                if (snapshot.val() !== null) {
                    var gameRef = Object.keys(snapshot.val())[0];
                    var data = snapshot.val()[gameRef];
                    console.log("[" + region + "] -  Updating: " + title);
                    var ref2 = database.ref(`/games/${gameRef}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }else {
                    // NO COINCIDE LUEGO SE CREA
                    var hash = toolbox.hashGenerator(title);
                    var ref2 = database.ref(`/games/${hash}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }
            });
            
            
            
            // CREO QUE CON ESTA MEGA FUNCION DE SAVE GAME YA NO HACE FALTA LA DE ASIA
        }
        
        
        /*
        var hash = toolbox.hashGenerator(title);
        var regionName = regionCode(region)
        var ref = database.ref(`/games/${hash}`);
        var dataToStore = {
            last_verification: new Date().getTime(),
            [regionName]: game
        };
        
        ref.update(Object.assign(dataToStore, regionData(region, game)))
        */
    },
    saveGameAsia: function(game, gameCode){
        var ref = database.ref(`/games/`);
        ref.orderByChild("international_gamecode").equalTo(gameCode).once("value").then(function(snapshot) {
            if (snapshot.val() !== null) {
                var gameRef = Object.keys(snapshot.val())[0];
                var data = snapshot.val()[gameRef];
                var title = ""
                if(typeof data.title !== 'undefined') {
                    title = data.title
                }else {
                    title = game.TitleName
                }
                console.log("[JPN] -  Updating: " + title);
                db.saveGame(game, title, "asia", gameCode);
                
                
                // PROBLEMA TM DE DARK SOULS
            } else {
                var title = game.TitleName
                console.log("[JPN] - New: " + title)
                db.saveGame(game, title, "asia");
            }
        });
    },
    flushDB: function() {
        var ref = database.ref(`/`);
         ref.update({
            games: ""
        });
    }
}
module.exports = db