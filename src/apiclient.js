var request = require('superagent');
var Promise = require('promise');
var util = require('./util');
var isUrl = require('is-url');
var fs = require('fs');
var tempfile = require('tempfile');

var endpoint = 'https://api.telegram.org/bot{0}/{1}';

function ApiClient(token){

	function _post(method, payload, options){
		return new Promise(function(resolve, reject){
			request
				.post(util.format(endpoint, token, method))
				.type('form')
				.send(payload || {})
				.send(options || {})
				.end(function(err, res){
					if (res.ok) {
						resolve(res.body);
					} else {
						reject(res.text);
					}
				});
		});
	}

	function _get(method, payload, options){
		return new Promise(function(resolve, reject){
			request
				.get(util.format(endpoint, token, method))
				.send(payload || {})
				.send(options || {})
				.end(function(err, res){
					if (res.ok) {
						resolve(res.body);
					} else {
						reject(res.text);
					}
				});
		});
	}

	function _postMedia(type, payload, options){
		return new Promise(function(resolve, reject){
			var
			method = util.format('{0}{1}{2}', 'send', type[0].toUpperCase(), type.substr(1, type.length -1))
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
								reject(err);
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
				if (util.isFileId(data)){
					r.field(type, data[0]);
				} else {
					r.attach(type, data[0]);
				}

				r.end(function(err, res){
					if (res.ok) {
						resolve(res.body);
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

	this.sendMessage = function(chatId, message, options){
		var payload = {
			chat_id: chatId
			, text: message
		};
		return _post('sendMessage', payload, options);
	};

	this.sendChatAction = function(chatId, action){
		var payload = {
			chat_id: chatId
			, action: action
		};
		return _post('sendChatAction', payload);
	};

	this.forwardMessage = function(chatId, fromChatId, messageId){
		var payload = {
			chat_id: chatId
			, from_chat_id: fromChatId
			, message_id: messageId
		};
		return _post('forwardMessage', payload);
	};

	this.sendLocation = function(chatId, lat, lon, options){
		var payload = {
			chat_id: chatId
			, latitude: lat
			, longitude: lon
		};
		return _post('sendLocation', payload, options);
	};

	this.sendPhoto = function(chatId, photo, options){
		var payload = {
			chat_id: chatId
			, media: photo
		};
		return _postMedia('photo', payload, options);
	};

	this.sendAudio = function(chatId, audio, options){
		var payload = {
			chat_id: chatId
			, media: audio
		};
		return _postMedia('audio', payload, options);
	};

	this.sendSticker = function(chatId, sticker, options){
		var payload = {
			chat_id: chatId
			, media: sticker
		};
		return _postMedia('sticker', payload, options);
	};

	this.sendDocument = function(chatId, doc, options){
		var payload = {
			chat_id: chatId
			, media: doc
		};
		return _postMedia('document', payload, options);
	};

	this.sendVideo = function(chatId, video, options){
		var payload = {
			chat_id: chatId
			, media: video
		};
		return _postMedia('video', payload, options);
	};

	this.getUserProfilePhotos = function(userId, options){
		var payload = {
			user_id: userId
		};
		return _get('getUserProfilePhotos', payload, options);
	};

	this.getMe = function(){
		return _get('getMe', {});
	};

	this.getUpdates = function(options){
		return _get('getUpdates', {}, options);
	};

	this.setWebhook = function(url){
		var payload = {
			url:  url
		};
		return _post('setWebhook', payload);
	};

	this.getUpdates = function(options){
		return _get('getUpdates', null, options);
	};

}


module.exports = ApiClient;
