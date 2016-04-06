//load modules
var request = require('request');
var fs = require('fs-extra');

//Request market
request('https://bittrex.com/api/v1.1/public/getmarketsummaries', function (error, response, body) {
  if (!error && response.statusCode == 200) {

  	//make json var
  	var data_raw = JSON.parse(body);
  	var data = data_raw.result;

    //Make a memory db
    var memory_coin_db = [
      {id: 1, desc: 'BITCNY-BTC'},
    ];

    //Make memory coin tag
    var memory_coin_tags_db = []

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
        
        //Push to memory_coin_db
        var tag = coin_name.substring(0,3)

        if (tag == "BIT")
        {

        } else if (tag == "BTC"){ 
          //Push the name
          memory_coin_db.push({
            id: memory_coin_db.length + 1,
            desc: coin_name
          }) 
        } else {

        };

        //Push cointag
         //Make coin tag
         if (tag == "BIT"){

         } else if (tag == "BTC") {
          var coin_tag = coin_name.substring(4)
          memory_coin_tags_db.push({
            currency: coin_tag
          })
         } else {

         };

        //Save data
        fs.writeFile("./tmp/bittrex/market/"+ coin_name +".json", save_data, function (err) {
            if (err) {
             return console.error("[BUG] Can't save" + coin_name +"exchange data by bittrex!");
           }
        });
    }
  }

   //Save memory coin db version
   var memory_coin_db_save_versoin = JSON.stringify(memory_coin_db);

   //Write memory_coin_db
   fs.writeFile("./conf/auto_conf/auto_coins.json", memory_coin_db_save_versoin, function (err) {
     if (err) {
       return console.error("[BUG] Can't save coins name from the memory_coin_db_save_versoin");
     }
   });

   //Save coin tage data
   var coin_tag = JSON.stringify(memory_coin_tags_db);
   fs.writeFile("./conf/auto_conf/auto_coin_tags.json", coin_tag, function (err) {
    if (err) {
     return console.error("[BUG] Can't save coins name from the coin_tag db");
    }
  });     
});