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

	function _requestMedia(type, payload, options){
		return new Promise(function(resolve, reject){
			var
			method = util.format('{0}{1}{2}', 'send', type[0].toUpperCase(), type.substr(1, type.length -1))
			, uppercased = method[0]
			, r = request
				.post(util.format(endpoint, token, method))
				.field('chat_id', payload.chat_id)
			, mediaData = new Promise(function(resolve, reject){
				if (isUrl(payload.media)){
					request
						.get(payload.media)
						.end(function(err, res){
							var tmpPath = tempfile(res.header['content-type'].split('/')[1]);
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
					resolve([payload.media, false]);
				}
			});
			for (var key in options){
				if (options.hasOwnProperty(key)){
					r.field(key, options[key]);
				}
			}
			mediaData.then(function(data){
				r.attach(type, data[0])
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

	};

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
		var payload = {
			chat_id: chatId
			, media: photo
		};
		return _requestMedia('photo', payload, options);
	};

	this.sendAudio = function(chatId, audio, options){
		var payload = {
			chat_id: chatId
			, media: audio
		};
		return _requestMedia('audio', payload, options);
	};

	this.sendSticker = function(chatId, sticker, options){
		var payload = {
			chat_id: chatId
			, media: sticker
		};
		return _requestMedia('sticker', payload, options);
	};

	this.sendDocument = function(chatId, doc, options){
		var payload = {
			chat_id: chatId
			, media: doc
		};
		return _requestMedia('document', payload, options);
	};

	this.sendVideo = function(chatId, video, options){
		var payload = {
			chat_id: chatId
			, media: video
		};
		return _requestMedia('video', payload, options);
	};

}


module.exports = ApiClient;
