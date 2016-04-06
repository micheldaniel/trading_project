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
    'stream' : true,
    'verbose' : true,
    'cleartext' : false
});

//Request balance
bittrex.getbalances( function( raw_data ) {
	var db = [];
	console.log(raw_data)
	var data = raw_data.result
    //Run save code
    var i = 0;
	for (i = 0; i < data.length; i++) {

		//scrap data
		var currency = data[i].Currency;
		var balance = data[i].Balance;
		var available = data[i].Available;
		var pending = data[i].Pending;

		//collect data
		var save_data = JSON.stringify({
			id: i,
			currency: currency,
			balance: balance,
			available: available,
			pending: pending
		});
	     
		//save code
		if (currency == 'BITCNY') {
			//Save data
	        fs.writeFile("tmp/bittrex/balance/BITCNY.json", save_data, function (err) {
	            if (err) {
	             return console.error("[BUG] Can't save" + currency +"balance data by bittrex!");
	           }
	        });
		} else {

			//Save data
	        fs.writeFile("tmp/bittrex/balance/"+currency+".json", save_data, function (err) {
	            if (err) {
	             return console.error("[BUG] Can't save" + currency +"balance data by bittrex!");
	           }
	        });
	        if (currency == "BTC"){
	        	
	        } else {
	        	db.push({coin_tag: currency});
	        }
		};
	}
	var db1 = JSON.stringify(db)
	console.log(db1)
	//Save data
	fs.writeFile("conf/auto_conf/balance_db.json", db1, function (err) {
		if (err) {
	        return console.error("[BUG] Can't save balance DB!");
	    }
	});	
});