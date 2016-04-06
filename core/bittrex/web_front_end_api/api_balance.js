//Load module
var jsonfile = require('jsonfile');
var fs = require("fs-extra");

//Load db
var database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json");

//Time reload
setInterval(function() {
	
	//Make mermory balance database
	var mermory_balance_db = [];

	//Push bitcoin to memory db for bitcoin
	var BTC_new_coin = JSON.parse(fs.readFileSync("./tmp/bittrex/balance/BTC.json"));
	
	mermory_balance_db.push({
		id: i,
		coin_tag: "BTC",
		balance: BTC_new_coin.balance,
		available: BTC_new_coin.available,
		pending: BTC_new_coin.pending
	});

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
	}

	//Export module
	exports.data = JSON.stringify(mermory_balance_db);
}, 6000);