//Load modules
var jsonfile = require('jsonfile');
var fs = require('fs');

//Load coin tag
var database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json");

//Memory database
var end_database = [];
//Getdepostit adress
var i = 0;
for (i = 0; i < database.length; i++) {

	//Get coin
	var coin_name = database[i].coin_tag;
	
	//data
	var data = JSON.stringify({buy_order: "false", sell_order: "false"});

	fs.writeFile("./conf/auto_conf/run/"+ coin_name +".json", data, function (err) {
	    if (err) {
	       return console.error("[BUG] Can't save" + coin_name +"balance data by bittrex!");
	    }
	});

};