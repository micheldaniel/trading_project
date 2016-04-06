//Load modules
var bittrex = require('./node_bittrex_api/node.bittrex.api.js');
var jsonfile = require('jsonfile');
var fs = require('fs');

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
		
				//Load buy programma
		if (buy_available == "false") {
	
		} else if (buy_available == "true") {
			
			//Make market variable
			var market1 = 'BTC-'+tag;			
			
			//Request btc balance
			var raw_btc_balance = jsonfile.readFileSync("./tmp/bittrex/balance/BTC.json");
			var btc_balance = raw_btc_balance.balance;
			
			//Load your coin config
			var coin_conf = jsonfile.readFileSync("./conf/auto_conf/buy_order/"+tag+".json");
	
			//Balance in coin config
			var max_balance = coin_conf.max_amount;
	
			//Get balance
			var raw_balance = jsonfile.readFileSync("./tmp/bittrex/balance/"+tag+".json");
			
			var balance = raw_balance.available;
			
			//Check the max amount
			if (max_balance > balance) {
				
				var raw_rate = coin_conf.price;
	
				//calc total cost
				var verschil__coin_balance = max_balance - balance;
				var cost_one_coin = raw_rate * 1.0025;
				
				var cost = verschil__coin_balance * cost_one_coin;
				
				if (cost > btc_balance) {
					
					//calc max quantity balance
					var quantity = btc_balance / cost_one_coin;

					//Make order
					bittrex.buylimit({ market : market1, quantity : quantity , rate : raw_rate}, function( data ) {
					    console.log( data );
					});	
					
				} else if (cost < btc_balance) {
					
					//Make order
					bittrex.buylimit({ market : market1, quantity : verschil__coin_balance , rate : raw_rate}, function( raw_data ) {
					    console.log( raw_data );				    
					});
				} else {
					console("There is no options available");
				}
				
				
				//var quantity = raw_totaal / 1.0025;
			}
		}
	
		//Load sell programma
		if (sell_available == "false") {
	
		} else if (sell_available =="true") {
	
			//Load your coin config
			var coin_conf = jsonfile.readFileSync("./conf/auto_conf/sell_order/"+tag+".json");
			var hold = coin_conf.hold;
	
			//Get balance
			var raw_balance = jsonfile.readFileSync("./tmp/bittrex/balance/"+tag+".json");
			var balance = raw_balance.balance;
	
			//Check first 
			if (balance > hold) {
	
				//Available
				var available = raw_balance.available;
				var hold_balance = coin_conf.hold;
	
	
				if (available > hold_balance) {
					
					//Make market variable
					var market1 = 'BTC-'+tag;
		
					var quantity = balance - hold_balance;
					var rate_sell = coin_conf.price;
					
					//Make request
					bittrex.selllimit({ market:market1, quantity:quantity, rate:rate_sell}, function( data ) {
					    console.log( data );
					});
				} else {
	
				}
			} else {
	
			}
		}
	}

}, 60000);