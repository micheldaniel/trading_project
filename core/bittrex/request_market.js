//load modules
var request = require('request');
var fs = require('fs');

//Time reload
setInterval(function() {

    //Request market
    request('https://bittrex.com/api/v1.1/public/getmarketsummaries', function (error, response, body) {
      if (!error && response.statusCode == 200) {
    
      	//make json var
      	var data_raw = JSON.parse(body);
      	var data = data_raw.result;
    
      	//Load fs module
        var fs = require('fs');
    
        //Run save software
        var i = 0;
        for (i = 0; i < data.length; i++) {
    
            //Scrap data
            var coin_name = data[i].MarketName;
            var bid = data[i].Bid;
            var ask = data[i].Ask;
    
            //From scrap data to file for save in the file
            var save_data = JSON.stringify({
                coin_name: coin_name,
                bid: bid,
                ask: ask
            });
    
            //Safe data
            fs.writeFile("./tmp/bittrex/market/"+ coin_name +".json", save_data, function (err) {
                if (err) {
                 return console.error("[BUG] Can't save" + coin_name +"exchange data by bittrex!");
               }
            });
        }
    
      }
    });
}, 60000);