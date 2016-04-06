//Load module
var fs = require ('fs');
var jsonfile = require('jsonfile');

//Open coin tags
var database_coin_tag = jsonfile.readFileSync("conf/auto_conf/auto_coin_tags.json");

//Time reload
setInterval(function() {

	//Memory db
	var memory_db = [];
	
	//Run save software
	var i = 0;
	for (i = 0; i < database_coin_tag.length; i++) {
	
		//Get cointag
		var coin_tag  = database_coin_tag[i].currency;
	
		//Get variable
		var raw_database = jsonfile.readFileSync("conf/auto_conf/run/"+coin_tag+".json");
	
		var buy_order = raw_database.buy_order;
		var sell_order = raw_database.sell_order;
	
		//Push to memory database
		memory_db.push({
			coin_tag: coin_tag,
			buy_order: buy_order,
			sell_order: sell_order
		});
	};

exports.data = memory_db

}, 60000);