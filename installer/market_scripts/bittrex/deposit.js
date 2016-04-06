//Load modules
var bittrex = require('./node_bittrex_api/node.bittrex.api.js');
var jsonfile = require('jsonfile');
var fs = require('fs');

//Load keys
var keys = jsonfile.readFileSync("conf/keys.json", "utf8");
var apikey = keys.bittrex.apikey;
var apisecret = keys.bittrex.apisecret;

//configure
bittrex.options({
    'apikey' : apikey,
    'apisecret' : apisecret,
    'stream' : "false",
    'verbose' : true,
    'cleartext' : false
});

//Load db
var database = jsonfile.readFileSync("./conf/auto_conf/auto_coin_tags.json");

//Getdepostit adress
var i = 0;
for (i = 0; i < database.length; i++) {

	//Get coin
	var coin_tag = database[i].currency
	
	//Make aderess
	bittrex.getdepositaddress({ currency : coin_tag }, function(data) {
	    console.log(data)
	});
};