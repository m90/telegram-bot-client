var Promise = require('promise');
var ApiClient = require('./src/apiclient');

function TelegramBotClient(token, promise){

	if (!token){
		throw new Error('You must pass a token to the constructor!');
	}

	promise = promise || Promise.resolve();

	var apiClient = new ApiClient(token);

	this.getMe = function(){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.getMe();
		}));
	};

	this.sendMessage = function(chatId, message){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendMessage(chatId, message);
		}));
	};

	this.forwardMessage = function(chatId, fromChatId, messageId){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.forwardMessage(chatId, fromChatId, messageId);
		}));
	};

	this.sendPhoto = function(chatId, photo, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendPhoto(chatId, photo, options);
		}));
	};

	this.sendAudio = function(chatId, audio, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendAudio(chatId, audio, options);
		}));
	};

	this.sendDocument = function(chatId, doc, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendDocument(chatId, doc, options);
		}));
	};

	this.sendVideo = function(chatId, video, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendVideo(chatId, video, options);
		}));
	};

	this.sendLocation = function(chatId, lat, lon, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendLocation(chatId, lat, lon, options);
		}));
	};

	this.sendChatAction = function(chatId, action){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.sendChatAction(chatId, action);
		}));
	};

	this.getUserProfilePhotos = function(chatId, options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.getUserProfilePhotos(chatId, options);
		}));
	};

	this.setWebhook = function(url){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.setWebhook(url);
		}));
	};

	this.getUpdates = function(options){
		return new TelegramBotClient(token, promise.then(function(){
			return apiClient.getUpdates(url);
		}));
	};

	this.delay = function(ms){
		return new TelegramBotClient(token, promise.then(function(){
			return new Promise(function(resolve, reject){
				setTimeout(resolve, ms);
			});
		}));
	};

	this.promise = function(){
		return promise;
	};

	this.catch = function(handler){
		promise.catch(handler);
	};

}

module.exports = TelegramBotClient;
