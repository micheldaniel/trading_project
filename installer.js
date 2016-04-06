//Load folder make module
var mkdirp = require('mkdirp');

//request folder
 mkdirp('/tmp/bittrex/market/', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder /tmp/bittrex/market/");		
 	} else {
 		console.log('[INFO] Bittrex market folder make');
 	}
 });
 
//balance folder
 mkdirp('/tmp/bittrex/balance/', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder /tmp/bittrex/balance/");		
 	} else {
 		console.log('[INFO] Bittrex balance folder make');
 	}
 }); 

//auto_conf folder
 mkdirp('conf/auto_conf', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder conf/auto_conf");		
 	} else {
 		console.log('[INFO] Bittrex market folder make');
 	}
 });
 
 //run
 mkdirp('conf/auto_conf/run', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder conf/auto_conf/run");		
 	} else {
 		console.log('[INFO] conf/auto_conf/run folder make');
 	}
 });

 //buy_order
 mkdirp('conf/auto_conf/buy_order', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder conf/auto_conf/buy_order");		
 	} else {
 		console.log('[INFO] conf/auto_conf/buy_order folder make');
 	}
 });

 //sell_order
 mkdirp('conf/auto_conf/sell_order', function (err) {
 	if (err) {
 			console.error("[BUG] Can't make folder conf/auto_conf/sell_order");		
 	} else {
 		console.log('[INFO] conf/auto_conf/sell_order folder make');
 	}
 });


//Bittrex
//Make market folder
mkdirp('tmp/bittrex/market/', function (err) {
	if (err) {
			console.error("[BUG] Can't make folder temp/bittrex/market/");		
	} else {
		console.log('[INFO] Bittrex market folder make');
	}
});

 //Make balance folder
 mkdirp('tmp/bittrex/balance/', function (err) {
   if (err) console.error("[BUG] can't make folder temp/bittrex/balance/");
     else {
     	console.log('[INFO] Bittrex balance folder make');
 	 }
 });

//tmp/website
mkdirp('tmp/website', function (err) {
	if (err) {
			console.error("[BUG] Can't make folder tmp/website");		
	} else {
		console.log('[INFO] tmp/website folder make');
	}
});

//Load fs module
var fs = require('fs');
var data = true

fs.writeFile("conf/first_starter.txt", data, function (err) {
    if (err) {
     return console.error("[BUG] Can't save first time starter!");
   }
    require('./installer/market_scripts/bittrex/request.js');
    require('./installer/market_scripts/bittrex/balance.js');
    require('./installer/market_scripts/bittrex/deposit.js');
    require('./installer/market_scripts/bittrex/make_order.js');
    require('./installer/market_scripts/bittrex/run.js');
});