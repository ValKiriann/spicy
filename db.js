const admin = require("firebase-admin");
const serviceAccount = require("./credentials/firebase-service-account.json");
var toolbox = require("./toolbox");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://spicy-switch.firebaseio.com/"
});

var database = admin.database();

function deepBalancer (route, target){
    var segment = route.split('.');
    for (var i in segment) {
        if (!target[segment[i]]) {
            target[segment[i]] = {};
        }
        target = target[segment[i]];
    }
}

function gameCodeGenerator (code) {
    return typeof(code) === "string" && code.length > 3 ? code.slice(4, 8) : false;
}

function regionCode (region) {
    return region.trim().toLowerCase() + "_raw"
}

function regionData (region, game, currentGameData) {
    region = region.split("_raw")[0];
    switch (region) {
        case "america":
            currentGameData.title = game.title
            currentGameData.title_raw = game.title.toLowerCase()
            currentGameData.game_code = gameCodeGenerator(game.game_code)
            currentGameData.categories = game.categories.category;
            deepBalancer("media.photos.america_front_box", currentGameData)
            currentGameData.media.photos.america_front_box = game.front_box_art;
            break;
         case "asia":
            //data.asia_uuid = "1234",
            currentGameData.asia_raw = game;
            deepBalancer("media.photos.asia_photo", currentGameData);
            currentGameData.media.photos.asia_photo = game.ScreenshotImgURL[0];
            currentGameData.last_verification =  new Date().getTime();
            break;
        case "europe":
            deepBalancer("media.photos.europe_front_box", currentGameData);
            currentGameData.media.photos.europe_front_box = game.image_url.replace("//", "")
            deepBalancer("media.photos.europe_rectangle", currentGameData)
            currentGameData.media.photos.europe_rectangle = game.image_url_h2x1_s.replace("//", "");
            deepBalancer("media.photos.europe_front_high", currentGameData);
            currentGameData.media.photos.europe_front_high =  game.image_url_sq_s.replace("//", "")
            currentGameData.europe_url = game.url;
            currentGameData.languages = game.language_availability[0].split(",");
            currentGameData.game_code = gameCodeGenerator(game.product_code_txt[0])
            currentGameData.categories = game.game_categories_txt;
            currentGameData.title = game.title;
            currentGameData.title_raw = game.title.toLowerCase();
            currentGameData.release_date = new Date(game.date_from).getTime();
            currentGameData.game_code_raw = game.product_code_txt[0];
            break;
        default:
            console.log("No tenemos una logica específica para esta region tan rota...")
    }
    return currentGameData
}

var asiaCoincidences = 0;

var db = {
    saveGame: function (game, title, region){
        var hash = toolbox.hashGenerator(title);
        var regionName = regionCode(region)
        var ref = database.ref(`/games/${hash}`);
        var dataToStore = {
            last_verification: new Date().getTime(),
            [regionName]: game
        };
        
        ref.update(regionData(regionName, game, dataToStore))
    },
    saveGameAsia: function(game, gameCode, region){
        var hash = toolbox.hashGenerator(gameCode);
        var regionName = regionCode(region)
        var ref = database.ref(`/games/`);
        ref.orderByChild("game_code").equalTo(gameCode).once("value").then(function(snapshot) {
            
            if (snapshot.val() !== null) {
                var gameRef = Object.keys(snapshot.val())[0];
                var currentGameData = snapshot.val()[gameRef];
                var ref = database.ref(`/games/${gameRef}`);
                ref.update(regionData(regionName, game, currentGameData))
            } else {
                var ref = database.ref(`/games/${hash}`);
                ref.update(regionData("asia", game, {}));
                console.log("[JPN] " + game.TitleName + " - No existe - " + gameCode)
            }
        });
    }
}
module.exports = db