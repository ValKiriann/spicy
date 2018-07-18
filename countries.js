const countries = require("country-data").countries;
const regions = require("country-data").regions;
const request = require ("request");
const db = require('./db');

// juego 1-2 switch mitico de salida no falla
var nsuid = {
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
var url = "https://api.ec.nintendo.com/v1/price?lang=en"
function validShops(world,gamecode){
    for (var continent in world) {
        let countryList = world[continent].map(code => countries[code]);
        for(var i = 0; i<countryList.length; i++){
            var url = `https://api.ec.nintendo.com/v1/price?lang=en&country=${countryList[i].alpha2}&ids=${nsuid[continent]}`
            //console.log(continent + " - " + countryList[i].alpha2 + " : " + countryList[i].name)
            setTimeout(function () {
                request(url, function (error, response, body) {
                    let info = JSON.parse(body)
                    // SI NO HAY ERROR = la ESHOP existe
                    //console.log(info)
                    if(!info.error){
                        // FUNCIONA NORMAL O HAY QUE SCRAPEAR? caso colombia y brasil x el momento
                        let status = "working"
                        if(info.prices[0].sales_status == "not_found") {
                            status = "scraping"
                            console.log(info.prices[0].sales_status + " - " + status)
                        } else { console.log(info.prices[0].sales_status + " - " + status) }
                        
                        var shop = countryList[i]
                        db.saveShop(shop, status, continent)
        
                    }else { 
                        
                    }
                    
                });
            }, 5000);
         
        }
    }
}
validShops(world);