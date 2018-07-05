const admin = require("firebase-admin");
const serviceAccount = require("./credentials/firebase-service-account.json");
var toolbox = require("./toolbox");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://spicy-switch.firebaseio.com/"
});

var database = admin.database();

function regionCode (region) {
    return region.trim().toLowerCase() + "_raw"
}

var db = {
    saveGame: function (game, title,  region){
        var hash = toolbox.hashGenerator(title);
        var regionName = regionCode(region)
        var ref = database.ref(`/games/${hash}`);
        ref.update({
            title,
            [regionName]: game
        })
    },
}



module.exports = db