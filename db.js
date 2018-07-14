const admin = require("firebase-admin");
const serviceAccount = require("./credentials/firebase-service-account.json");
const toolbox = require("./toolbox");
const msg = require("./msg_conf")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://spicy-switch.firebaseio.com/"
});

var database = admin.database();

function regionData (region, game) {
    //region = region.split("_raw")[0];
    var data = {};
    switch (region) {
        case "usa":
            data.title_usa = game.title
            data.title_clean = toolbox.cleanTitle(game.title);
            data.gamecode_usa = game.game_code
            if(toolbox.validGamecode(game.game_code)){ data.gamecode_intl = toolbox.iGamecodeGenerator(game.game_code) }
            data.categories = game.categories.category;
            if(game.nsuid) { data.nsuid_usa = game.nsuid }
            data.img_usa = game.front_box_art;
            if(game.video_link){
                 data.video_usa = game.video_link
            }
            break;
         case "jpn":
            data.gamecode_jpn = game.InitialCode
            if(toolbox.validGamecode(game.InitialCode)){ data.gamecode_intl = toolbox.iGamecodeGenerator(game.InitialCode) }
            data.title_jpn = game.TitleName
            data.nsuid_jpn = game.LinkURL.replace("/titles/","");
            data.img_jpn = game.ScreenshotImgURL;
            break;
        case "eur":
            data.europe_url = game.url;
            data.languages = game.language_availability[0].split(",");
            data.gamecode_eur = game.product_code_txt[0]
            if(toolbox.validGamecode(game.product_code_txt[0])){ data.gamecode_intl = toolbox.iGamecodeGenerator(game.product_code_txt[0]) }
            data.categories = game.game_categories_txt;
            data.title_eur = game.title;
            data.title_clean = toolbox.cleanTitle(game.title);
            data.releasedate = new Date(game.date_from).getTime();
            data.nsuid_eur = game.nsuid_txt[0];
            data.img_eur_sq = game.image_url_sq_s.replace("//", "https//");
            data.img_eur_rc = game.image_url_h2x1_s.replace("//", "https//");
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
            var regionName = "raw_" + region;
            var dataToStore = {
                last_verification: new Date().getTime(),
                [regionName]: game
            };
            
            // TODO refactorizar ref2
            ref.orderByChild("gamecode_intl").equalTo(iGamecode).once("value").then(function(snapshot) {
                // COINCIDE LUEGO EXISTE
                if (snapshot.val() !== null) {
                    var gameRef = Object.keys(snapshot.val())[0];
                    var data = snapshot.val()[gameRef];
                    console.log("[" + region + "] " + msg.success("Updating: ") + title + " | " + data.gamecode_intl + " = " + iGamecode);
                    var ref2 = database.ref(`/games/${gameRef}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }else {
                    // NO COINCIDE LUEGO SE CREA
                    title_clean = toolbox.cleanTitle(title);
                    var hash = toolbox.hashGenerator(title_clean);
                    var ref2 = database.ref(`/games/${hash}`);
                    console.log("[" + region + "] " + msg.warning("Creating: ") + title + " | " + iGamecode);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }
            });
        }else {
            //TODAVIA SIN GAMECODE LUEGO NO TENEMOS PATRON INTERNACIONAL
            // PROBAMOS POR SI ENCONTRAMOS POR EL TITULO UN MATCH
            //TITLE RAW NEW EN UNA VAR
            var ref = database.ref(`/games/`);
            var title_clean = toolbox.cleanTitle(title);
            var dataToStore = {
                last_verification: new Date().getTime(),
                [regionName]: game
            };
            ref.orderByChild("title_clean").equalTo(title_clean).once("value").then(function(snapshot) {
                // COINCIDE LUEGO EXISTE
                if (snapshot.val() !== null) {
                    var gameRef = Object.keys(snapshot.val())[0];
                    var data = snapshot.val()[gameRef];
                    console.log("[" + region + "] " + msg.success("Updating: ") + title + " | " + data.title_clean + " = " + title_clean);
                    var ref2 = database.ref(`/games/${gameRef}`);
                    ref2.update(Object.assign(dataToStore, regionData(region, game)))
                }else {
                    // NO COINCIDE LUEGO SE CREA
                    var hash = toolbox.hashGenerator(title_clean);
                    var ref3 = database.ref(`/games/${hash}`);
                    console.log("[" + region + "] " + msg.warning("Creating: ") + title + " | " + title_clean);
                    ref3.update(Object.assign(dataToStore, regionData(region, game)))
                }
            });
            
        }
        
    },
    flushDB: function(parameter) {
        var ref = database.ref(`/`);
         ref.update({
            [parameter]: ""
        });
    },
    getGames: function(cb) {
        var ref = database.ref(`/games/`);
        ref.orderByChild("release_date").once("value").then(function(snapshot) {
            if (snapshot.val() !== null) {
                cb(false, {data: snapshot.val()});
            } else {
                cb(true, {msg: "No games"})
            }
        });
    },
    getGame: function(gameID, cb) {
        var ref = database.ref(`/games/`);
        ref.orderByChild("international_gamecode").equalTo(gameID).once("value").then(function(snapshot) {
            if (snapshot.val() !== null) {
                var gameRef = Object.keys(snapshot.val())[0]
                cb(false, {data: snapshot.val()[gameRef]});
            } else {
                cb(true, {msg: "Not found"})
            }
        });
    }
}


// No te lo dejes pa mas tarde...
//const Jp_CURRENT = "https://www.nintendo.co.jp/data/software/xml-system/switch-onsale.xml";
//const JP_COMING = "https://www.nintendo.co.jp/data/software/xml-system/switch-coming.xml";
//const countries = require("country-data").countries;
//const regions = require("country-data").regions;

module.exports = db