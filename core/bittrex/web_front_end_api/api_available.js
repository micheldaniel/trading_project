//Load module
var jsonfile = require('jsonfile');

//Load db
var database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json");

//Time reload
setInterval(function() {
	
	//Make mermory balance database
	var memory_database = [];
	
	//Loop
	var i = 0;
	for (i = 0; i < database.length; i++) {
	
		//Get coin
		var name = database[i].coin_tag;
	
		//Make coin name
		var save_name = name + ".json";
		
		//Push to memory db
		var new_coin = jsonfile.readFileSync("./conf/auto_conf/run/"+save_name);
	
		memory_database.push({
			coin: name,
			buy_order: new_coin.buy_order,
			sell_order: new_coin.sell_order
		});
	}
	
	//Export module
	exports.data = JSON.stringify(memory_database);

}, 60000);