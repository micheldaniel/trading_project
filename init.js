//Starter
var jsonfile = require('jsonfile');
var terminalTab = require('terminal-tab');

//Checking for first time starter
var raw_checking = jsonfile.readFileSync("conf/first_starter.txt", "utf8");
var checking = raw_checking.first_time;

if (checking = true) {

	//Check operating system
	//Load os module
	var os = require('os');

	//Os check
	var operation_systeem = os.type();

	//Os chcek
	if (operation_systeem == "Darwin" || operation_systeem == "Linux") {

		//terminal tab
		var terminalTab = require('terminal-tab');

		//Load terminal tab
		terminalTab.open('echo Start the installer; node installer.js && ctrl+c && exit');
	} else if (operation_systeem == "Windows_NT"){
		require('./installer.js')
	} else {
		console.error("[BUG] Your operating system is not known in the installer. Please open issiue by github.");
	}

} else if (checking == false) {

} else {
	console.error("[BUG] There is no first_time.json file");
}