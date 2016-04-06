//Load module
var jsonfile = require('jsonfile');

//Load coin tag database
var coin_tag_database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json", "utf-8");

//Time reload
setInterval(function() {

	//Creat memory database
	var database = [];
	
	//Load scrapper
	var i = 0;
	for (i = 0; i < coin_tag_database.length; i++) {
	
		//Get coin
		var name = coin_tag_database[i].coin_tag;
	
		//Get available data
		var push = jsonfile.readFileSync("./conf/auto_conf/run/"+name+".json", "utf-8");
	
		//Push available data
		database.push(push);
	}
	
	//Export memory database
	exports.data = database;
}, 60000);