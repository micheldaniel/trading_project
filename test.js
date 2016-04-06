var publicIp = require('public-ip');
 
publicIp.v4(function (err, ip) {
	console.log(ip);
	//=> '46.5.21.123'
});
 
publicIp.v6(function (err, ip) {
	console.log(ip);
});
