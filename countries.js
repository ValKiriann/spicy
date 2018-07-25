const countries = require("country-data").countries;
const regions = require("country-data").regions;
const db = require('./db');
const toolbox = require('./toolbox')

// juego 1-2 switch mitico de salida no falla
let nsuid = {
    usa: "70010000000185",
    eur: "70010000000184",
    jpn: "70010000000039"
}
// coge todos los paises de este continente (NOT VERIDICO SINO LO QUE NINTENDO CONSIDERA ESTE CONTINENTE)
var world = {
    usa : regions.southAmerica.countries
        .concat(regions.centralAmerica.countries)
        .concat(regions.northernAmerica.countries),
    eur: regions.northernEurope.countries 
        .concat(regions.southernEurope.countries)
        .concat(regions.easternEurope.countries)
        .concat(regions.westernEurope.countries)
        .concat(regions.australia.countries)
        .concat(regions.southernAfrica.countries),
    jpn: regions.centralAsia.countries 
        .concat(regions.southernAsia.countries)
        .concat(regions.southeastAsia.countries)
        .concat(regions.eastAsia.countries)
        .concat(regions.westernAsia.countries)
}

async function validShops(world){
    for (var region in world) {
        let countryList = world[region].map(code => countries[code]);
        for(var i = 0; i<countryList.length; i++){
            var url = `https://api.ec.nintendo.com/v1/price?lang=en&country=${countryList[i].alpha2}&ids=${nsuid[region]}`;
            var countryName = countryList[i].name
            console.log("Data to be collected from", countryName);
            try {
                let res = await toolbox.promiseRequest(url);
                res = JSON.parse(res)
                let mode = "api" 
                if(res.prices[0].sales_status == "not_found") {
                    mode = "scraping"
                } 
                db.saveShop(countryList[i], mode, region);
                console.log("data storaged for", countryName);
                
            } catch (err) {
                console.log("404 for", countryName);
            }
        }
    }
}
validShops(world);

