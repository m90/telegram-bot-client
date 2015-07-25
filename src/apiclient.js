var request = require('superagent');
var Promise = require('promise');
var util = require('./util');
var http = require('http');
var isUrl = require('is-url');
var fs = require('fs');
var tempfile = require('tempfile');

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
			, message_id: messageId
		};
		return _request('forwardMessage', payload);
	};

	this.sendLocation = function(chatId, lat, lon, options){
		var payload = {
			chat_id: chatId
			, latitude: lat
			, longitude: lon
		};
		return _request('sendLocation', payload, options);
	}

	this.sendPhoto = function(chatId, photo, options){
		return new Promise(function(resolve, reject){
			var
			r = request
				.post(util.format(endpoint, token, 'sendPhoto'))
				.field('chat_id', chatId)
			, photoData = new Promise(function(resolve, reject){
				if (isUrl(photo)){
					request
						.get(photo)
						.end(function(err, res){
							var tmpPath = tempfile('.jpg');
							if (err){
								reject(err)
								return;
							}
							fs.writeFile(tmpPath, res.body, function(err){
								if (err){
									reject(err);
								} else {
									resolve([tmpPath, true]);
								}
							});
						});
				} else {
					resolve([photo, false]);
				}
			});
			for (var key in options){
				if (options.hasOwnProperty(key)){
					r.field(key, options[key]);
				}
			}
			photoData.then(function(data){
				r.attach('photo', data[0])
					.end(function(err, res){
						if (res.ok) {
							resolve(JSON.stringify(res.body));
						} else {
							reject(res.text);
						}
						if (data[1]){
							fs.unlink(data[0]);
						}
					});
			}, function(err){
				reject(err);
			});
		});
	}

}


module.exports = ApiClient;
