var nintendo = require('./eshop');
var Scheduled = require("scheduled");

/*

var usaCron = new Scheduled({
    id: "usaCron",
    pattern: "48 * * * * *", // Tarea a las 10:00
    task: function(){
        nintendo.getUsa();
    }
}).start();

var eurCron = new Scheduled({
    id: "eurCron",
    pattern: "50 * * * * *", // Tarea a las 10:15
    task: function(){
        nintendo.getEur();
    }
}).start();

var jpnCron = new Scheduled({
    id: "eurCron",
    pattern: "52 * * * * *", // Tarea a las 10:15
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
nintendo.getEur();
//nintendo.getJpn();



// when we have to restore the database
//const db = require("./db");
//db.flushDB("games");

// LOGS CON WINSTON?