//load modules
var request = require('request');
var fs = require('fs');

//Request market
request('https://bittrex.com/api/v1.1/public/getmarkets', function (error, response, body) {
  if (!error && response.statusCode == 200) {

  	//make json var
  	var data_raw = JSON.parse(body);
  	var data = data_raw.result;

    //Run save software
    var i = 0;
    for (i = 0; i < data.length; i++) {

        //Scrap data
        var coin_name = data[i].MarketCurrency;
        var price = "0";
        var amount = "0";
        var max_amount = "0";
        var max_hold = "0";
        var max_balance = "0";
        
        //From scrap data to file for save in the file
        var save_data = JSON.stringify({
            coin_name: coin_name,
            price: price,
            amount: amount,
            max_amount: max_amount,
        });

        //Safe data
        fs.writeFile("./conf/auto_conf/buy_order/"+ coin_name +".json", save_data, function (err) {
            if (err) {
             return console.error("[BUG] Can't save" + coin_name +"first time order set up");
           }
        });

            var save_data1 = JSON.stringify({
            coin_name: coin_name,
            price: price,
            amount: amount,
            hold: max_hold
        });

        //Safe data
        fs.writeFile("./conf/auto_conf/sell_order/"+ coin_name +".json", save_data1, function (err) {
            if (err) {
             return console.error("[BUG] Can't save " + coin_name +"first time order set up");
           }
        });        
    }

  }
});