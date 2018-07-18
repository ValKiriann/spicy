var nintendo = require('./eshop');
var Scheduled = require("scheduled");


/*

var usaCron = new Scheduled({
    id: "usaCron",
    pattern: "51 * * * * *", // Tarea a las 10:00
    task: function(){
        nintendo.getUsa();
    }
}).start();

var eurCron = new Scheduled({
    id: "eurCron",
    pattern: "52 * * * * *", // Tarea a las 10:15
    task: function(){
        nintendo.getEur();
    }
}).start();

var jpnCron = new Scheduled({
    id: "eurCron",
    pattern: "53 * * * * *", // Tarea a las 10:15
    task: function(){
        nintendo.getJpn();
    }
}).start();

*/

/*
//http://www.nncron.ru/help/EN/working/cron-format.htm
//http://www.nncron.ru/help/EN/working/cron-format.htm
// "date" en terminal te da eltiempo

*/
//nintendo.getUsa();
//nintendo.getEur();
//nintendo.getJpn();



// when we have to restore the database
//const db = require("./db");
//db.flushDB("games");

// LOGS CON WINSTON?
const SwitchEshop = require('nintendo-switch-eshop');
function shops() {
    var p = SwitchEshop.getShopsAmerica();
    p.then(function(value) {
   // cumplimiento
   console.log(typeof(value))
   console.log(value.length)
   console.log(value)
  }, function(reason) {
  // rechazo
  console.log("no funciona")
});
}
shops();