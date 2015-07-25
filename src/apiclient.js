var request = require('superagent');
var Promise = require('promise');
var util = require('./util');

var endpoint = 'https://api.telegram.org/bot{0}/{1}';

function ApiClient(token){

	this.sendMessage = function(chatId, message, options){
		return new Promise(function(resolve, reject){
			var payload = {
				chat_id: chatId
				, text: message
			};
			request
				.post(util.format(endpoint, token, 'sendMessage'))
				.type('form')
				.send(payload)
				.send(options || {})
				.end(function(err, res){
					if (res.ok) {
						resolve(JSON.stringify(res.body));
					} else {
						reject(res.text);
					}
				});
		});
	};

}


module.exports = ApiClient;
