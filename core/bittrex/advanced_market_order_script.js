//Load modules
var bittrex = require('./node_bittrex_api/node.bittrex.api.js');
var jsonfile = require('jsonfile');
var fs = require('fs');
var request = require('request');

//Load bittrex
var keys = jsonfile.readFileSync("conf/keys.json", "utf8");
var apikey = keys.bittrex.apikey;
var apisecret = keys.bittrex.apisecret;

//bittrex configure
bittrex.options({
    'apikey' : apikey,
    'apisecret' : apisecret,
    'stream' : false,
    'verbose' : true,
    'cleartext' : false
});

//Load coin db
var coin_db = jsonfile.readFileSync('./conf/auto_conf/balance_db.json', "utf8");

//Time reload
setInterval(function() {
	
	//Load loop
	var i;
	for (i = 0; i < coin_db.length; i++) {
	
		//Load coin tag
		var tag = coin_db[i].coin_tag;
		
		//Check for available
		var raw_available = jsonfile.readFileSync('./conf/auto_conf/run/'+tag+'.json');
		var buy_available = raw_available.buy_order;
		var sell_available = raw_available.sell_order;
		
		//Check of buy is available
		if (buy_available == "true") {
            
            //Get config data
            var config_data = jsonfile.readFileSync('')
            
            //Get little market info
            var market_little_data = jsonfile.readFileSync('./tmp/bittrex/market/BTC-'+tag+'.json');
            var bid = market_little_data.bid;
            
            if (bid = )
		}
		
		//Check of sell is available
		if (sell_available == "true") {
		    
		}
		
	}
}, 60000);