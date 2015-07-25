var request = require('superagent');
var Promise = require('promise');
var util = require('./util');

var endpoint = 'https://api.telegram.org/bot{0}/{1}';

function ApiClient(token){


	function _request(method, payload, options){
		return new Promise(function(resolve, reject){
			request
				.post(util.format(endpoint, token, method))
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
	}

	this.sendMessage = function(chatId, message, options){
		var payload = {
			chat_id: chatId
			, text: message
		};
		return _request('sendMessage', payload, options);
	};

	this.forwardMessage = function(chatId, fromChatId, messageId){
		var payload = {
			chat_id: chatId
			, from_chat_id: fromChatId
			, message_id: message_id
		};
		return _request('forwardMessage', payload, options);
	};

}


module.exports = ApiClient;
