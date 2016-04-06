//load modules
var request = require('request');
var fs = require('fs');

//Time reload
setInterval(function() {

    //Request market
    request('https://bittrex.com/api/v1.1/public/getmarketsummaries', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            var raw_data = JSON.parse(body);
            var data = raw_data.result;
            
            //scrap all data
            var i = 0;
            for (i = 0; i < data.length; i++) {
                
                //If stament
                var volume = data[i].Volume;
                if (volume == "0.00000000"){
                    console.log("[INFO]"+data[i].MarketName+" have 0 trading volume");
                } else {
                    
                    //scrap data
                    var save_data = JSON.stringify({
                       coin_name: data[i].MarketName,
                       bid: data[i].Bid,
                       ask: data[i].Ask
                    });
                    
                    //Save data
                    fs.writeFile("./tmp/bittrex/market/"+ data[i].MarketName +".json", save_data, function (err) {
                        if (err) {
                         return console.error("[BUG] Can't save" + data[i].MarketName +"exchange data by bittrex!");
                       }
                    });
                }  
            }
        }
    });
}, 60000);