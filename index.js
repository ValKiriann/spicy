var db = require('./db');

db.saveGame("data...", "pacman 5", "america").then(()=>{
    console.log("Oh! yEAH!")
    db.close()
}).catch(err => console.log(err))
