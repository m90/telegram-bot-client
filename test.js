var Client = require('./index');

var client = new Client('114522183:AAGx28VBTUZ5iZMcPxTF2-d-dszTYnrBXsw');

var testId = 89149957;

client
	.sendMessage(testId,'lol')
	.sendMessage(testId, 'wut')
	.delay(4000)
	.sendMessage(testId, 'Back again')
	.delay(10000)
	.sendMessage(testId, 'Schnarch')
	.catch(function(err){
		console.log(err);
	});
