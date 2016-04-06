//Start analaytics
/*require('pmx').init({
  http : true,
  network : true,
  ports : true
});*/

//Load modules
var http = require("http");
var express = require('express');
var path = require ('path');
var fs = require ('fs-extra');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

//Use middleware
app.use(bodyParser());

//Load bittrex
 //Cores
 require('./core/bittrex/make_order.js');
 require('./core/bittrex/request_market.js');
 
//Web interface
 var api_available = require('./core/bittrex/web_front_end_api/api_available.js');
 var active = require('./core/bittrex/web_front_end_api/api_available.js');
 var active_balance = require('./core/bittrex/balance.js');
 var run = require('./core/bittrex/web_front_end_api/api_available.js');


//map config
 //website egine
 app.set('view engine', 'ejs');
 
 //website folder name
 app.set('views', path.join(__dirname, 'website/html'));

 //Load css
 app.use('/css', express.static('website/css'));

 //Load javascript folder
 app.use('/js', express.static('website/js'));

//Starter webserver
http.createServer(

	//Get
	app.get('/', function (req,res){
		var data = fs.readFileSync("./conf/config.json", "utf8");
    	res.render('index', {
    		ip_config: data
    	})
	}),

	//active
	app.get('/active', function (req,res){
    	res.render('active', {
    		active: active.data
    	})
	}),

	//Balance
	app.get('/balance', function (req,res){
    	res.render('balance', {
    		balance: active_balance.data
    	})
	}),
	
	app.get('/select_market', function (req, res){
		res.render('select_market', {

		})
	}),
	
	//Fist Set auto buy
	app.get('/market_order', function (req, res){
		var ask = JSON.stringify(fs.readFileSync("tmp/website/ask.txt", "utf8"));
		var buy = JSON.stringify(fs.readFileSync("tmp/website/buy.txt", "utf8"));
		
		res.render('market_order', {
			ask: ask,
			buy: buy
		})
	}),

	//Conf order
	app.get('/confirm_order', function (req, res){
			var data = jsonfile.readFileSync("./tmp/website/first_order.json");
		res.render('conf_order', {
			data : data.data
		})
	}),

	//Order
	app.get('/order', function (req, res){
		res.render('order', {

		})
	}),
	//API GET
	 //Bittrex balance
     app.get('/api/bittrex/balance', function (req, res) {
     	res.send(active_balance.data);
     }),

     //Bittrex order
     app.get('/api/bittrex/order', function (req, res) {
     	var buy_memory_db = [];
     	var sell_memory_db = [];
     	var raw_data = jsonfile.readFileSync("conf/auto_conf/auto_coin_tags.json");

     	for (var i = 0; i < raw_data.length; i++) {

     		var buy_order = raw_data.buy_order;
     		var sell_order = raw_data.sell_order;

     		if (buy_order == "true") {

     			var coin = raw_data[i].currency;
     			var data = jsonfile.readFileSync("conf/auto_conf/buy_order/"+coin+".json");

     			buy_memory_db.push({
     				coin: coin,
     				order_type: data.buy_order,
     				price: data.price,
     				max_amount: data.max_amount
     			});
     		} else {

     		}

     		if (sell_order == "true") {

     			var coin = raw_data[i].currency;
     			var data = jsonfile.readFileSync("conf/auto_conf/sell_order/"+coin+".json");

     			sell_memory_db.push({
     				coin: coin,
     				order_type: data.buy_order,
     				price: data.price,
     				hold: data.hold
     			});
     		} else {

     		};
     	};

     	var total = JSON.stringify({
     		buy: buy_memory_db,
     		sell: sell_memory_db
     	})

     	res.send(total)
     }),

     app.get('/api/bittrex/run', function (req, res) {
     	res.send(run.data);
     }),

    //API POST
    //Request market info
	 app.post('/get_request', function (req, res) {
		var cointag = req.body.cointag;
		
		//Memory db
		var sell_ask_db = [];
		var buy_ask_db = [];

		//Request data
		request('https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-'+cointag+'&type=both', function (error, response, raw_data) {
		  if (!error && response.statusCode == 200) {

			//to json data
			var data = JSON.parse(raw_data);

			var sell = data.result.sell;
			var buy = data.result.buy;

			//Run save software for sell
			var i = 0;
			for (i = 0; i < sell.length; i++) {

				//calc total
				var quantity_calc = JSON.parse(sell[i].Quantity);
				var price_calc = JSON.parse(sell[i].Rate);
				var total = quantity_calc * price_calc;

				//count
				var count = i;
			    //scrap data sell orderbook
			    sell_ask_db.push({
			    	id: count,
			    	quantity: sell[i].Quantity,
				    rate: sell[i].Rate,
				    total: total
				});
			};

			//Make a normal var
			var sell_ask = JSON.stringify(sell_ask_db)

			//Save cointag data
			fs.writeFile("./tmp/website/ask.txt", sell_ask, function (err) {
			if (err) {
			    	return console.error("[BUG] Can't save" + sell_ask +"order from bittrex!");
			    }
			});	 	

			//Run save software for buy
			var i = 0;
			for (i = 0; i < buy.length; i++) {

				//calc total
				var quantity_calc = JSON.parse(buy[i].Quantity);
				var price_calc = JSON.parse(buy[i].Rate);
				var total = quantity_calc * price_calc;

				//count
				var count = i;

			    //scrap data buy orderbook
				buy_ask_db.push({
					id: count,
				    quantity: buy[i].Quantity,
				    rate: buy[i].Rate,
				    total: total
				});			
			}

			//Make a normal var
			var buy_ask = JSON.stringify(buy_ask_db);

			//Save buy ask db
			fs.writeFile("./tmp/website/buy.txt", buy_ask, function (err) {
				if (err) {
				  	return console.error("[BUG] Can't save" + buy_ask +"order from bittrex!");
				}
			});	 

			res.redirect('/market_order');
		  }
		})
	 }),
		
	//post
		//Sell first order
		app.post('/sell_first_time', function(req, res) {
			
			//Data
			
			var data = JSON.stringify({
				order_type: "sell",
				select_coin: req.body.coin_tag,
				price: req.body.price,
				quantity: req.body.quantity,
				amount: req.body.amount,
				hold: req.body.hold
			});
			
			fs.writeFile("./tmp/website/first_order.json", data, function (err) {
				if (err) {
				  	return console.error("[BUG] Can't save fist_order data!");
				}
			});	
			res.redirect('/confirm_order');
		}),
		
		//buy first order
		app.post('/buy_first_time', function(req, res) {
			
			var select_coin = req.body.buy_coin_tag;
			var price = req.body.buy_price;
			var quantity = req.body.buy_quantity;
			var amount = req.body.buy_amount;
			var max_amount = req.body.buy_max_amount;
			
			
			//Data
			var data = JSON.stringify({
				order_type: "buy",
				select_coin: select_coin,
				price: price,
				quantity: quantity,
				amount: amount,
				max_amount: max_amount
			});
			
			fs.writeFile("./tmp/website/first_order.json", data, function (err) {
				if (err) {
				  	return console.error("[BUG] Can't save fist_order data!");
				}
			});	 
			
			res.redirect('/confirm_order');
		}),		

		//active
		app.post('/post_active', function(req, res) {
			
			var select_coin = req.body.cointag;
			var buy_order_active = req.body.buy_order_active;
			var sell_order_active = req.body.sell_order_active;
			
			
			//Data
			var data = JSON.stringify({
				buy_order: buy_order_active,
				sell_order: sell_order_active
			});
			console.log(data)
			fs.writeFile("./conf/auto_conf/run/"+select_coin+".json", data, function (err) {
				if (err) {
				  	return console.error("[BUG] Can't save run data!");
				}
			});
			res.redirect('/');
		}),	
		
		//Conf order
		app.post('/conf_order', function (req, res) {
			
			var check = req.body.option;
			
			if (check == "correct"){
				var data = jsonfile.readFileSync("./tmp/website/first_order.json");
				
				var order_type = data.order_type;

				if (order_type == "sell") {
					var select_coin = data.select_coin;
					var price = data.price;
					var quantity = data.quantity;
					var hold = data.hold;
					
					var collect = JSON.stringify({
						coin_name: select_coin,
						price: price,
						amount: "0",
						hold: hold
					})

					fs.writeFile("./conf/auto_conf/sell_order/"+select_coin+".json", collect, function (err) {
						if (err) {
						  	return console.error("[BUG] Can't save confirm data!");
						}
					});						
				} else if (order_type == "buy") {
					var select_coin = data.select_coin;
					var price = data.price;
					var quantity = data.quantity;
					var max_amount = data.max_amount;
					
					var collect = JSON.stringify({
						coin_name: select_coin,
						price: price,
						amount: "0",
						max_amount: max_amount
					})

					fs.writeFile("./conf/auto_conf/buy_order/"+select_coin+".json", collect, function (err) {
						if (err) {
						  	return console.error("[BUG] Can't save confirm data!");
						}
					});
					
					fs.remove('/tmp/website/first_order.json', function (err) {
					  if (err) return console.error(err);
					 
					  console.log('success remoce first_order.json!');
					});
				}
			} else {
				
			}
			res.redirect('/');
		})
).listen(process.env.PORT, process.env.IP, function (res, req) {
  console.log("[INFO] Server is working");
});