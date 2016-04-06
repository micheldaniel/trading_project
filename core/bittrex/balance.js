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
		'verbose' : false,
		'cleartext' : false
});

//Load db
var database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json");

//Time reload
setInterval(function() {
	
	//Request balance
	bittrex.getbalances( function( totaal_balance ) {
	
		//Make json var
		var raw_data = totaal_balance.result;
	
		//Run save software
		var i = 0;
		for (i = 0; i < raw_data.length; i++) {
	
			//scrap data
			var data = JSON.stringify({
				balance: raw_data[i].Balance,
				available: raw_data[i].Available,
				pending: raw_data[i].Pending
			});
		
			//Name
			var coin_name = raw_data[i].Currency;
	
			//Save data
			fs.writeFile("./tmp/bittrex/balance/"+ coin_name +".json", data, function (err) {
				if (err) {
				 return console.error("[BUG] Can't save" + coin_name +"balance data by bittrex!");
				}
			});
			
			mermory_balance_db.push({
				id: i,
				coin_tag: coin_name,				
				balance: raw_data[i].Balance,
				available: raw_data[i].Available,
				pending: raw_data[i].Pending				
			});
		} 
	});
	
	//Memory database
	var mermory_balance_db = [];
	
	//BTC
	var btc = jsonfile.readFileSync("./tmp/bittrex/balance/BTC.json");
	mermory_balance_db.push({
		id: i,
		coin_tag: "BTC",
		balance: btc.balance,
		available: btc.available,
		pending: btc.pending
	});	
		
	//Run save software
	var i = 0;
	for (i = 0; i < database.length; i++) {	
		
		//Get coin
		var name = database[i].coin_tag;
	
		//Make coin name
		var save_name = name+ ".json";
			
		//Push to memory db
		var new_coin = JSON.parse(fs.readFileSync("./tmp/bittrex/balance/"+save_name));
		mermory_balance_db.push({
			id: i,
			coin_tag: name,
			balance: new_coin.balance,
			available: new_coin.available,
			pending: new_coin.pending
		});
	};
	
	//Export module
	exports.data = JSON.stringify(mermory_balance_db);
}, 60000);