var nintendo = require('./eshop');

var Scheduled = require("scheduled");
/*
//http://www.nncron.ru/help/EN/working/cron-format.htm
var AsianCronJob = new Scheduled({
    id: "minuteTaskEven",
    pattern: "00 10 * * * *", // Tarea a las 10:00
    task: function(){
        nintendo.getAsia();
    }
}).start();


//http://www.nncron.ru/help/EN/working/cron-format.htm

var EuropeCronJob = new Scheduled({
    id: "minuteTaskEven",
    pattern: "15 10 * * * *", // Tarea a las 10:15
    task: function(){
        nintendo.getEurope();
    }
}).start();

// "date" en terminal te da eltiempo


// Scheduled
*/
//nintendo.getAmerica();
//nintendo.getEurope();
nintendo.getAsia();



// when we have to restore the database
//const db = require("./db");
//db.cleanDB();

