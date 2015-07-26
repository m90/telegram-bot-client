var Promise = require('promise');
var ApiClient = require('./src/apiclient');

function TelegramBotClient(token, promise){

	if (!token){
		throw new Error('You must pass a token to the constructor!');
	}

	promise = promise || Promise.resolve();

	var
	apiClient = new ApiClient(token)
	, makeChainableMethod = function(method){
		return function(){
			var args = [].slice.call(arguments);
			return new TelegramBotClient(token, promise.then(function(){
				return apiClient[method].apply(null, args);
			}));
		};
	};

	for (var method in apiClient){
		if (apiClient.hasOwnProperty(method)){
			this[method] = makeChainableMethod(method);
		}
	}

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

	this.then = function(handler, errHandler){
		promise.then(handler, errHandler);
	};

	this.catch = function(handler){
		promise.catch(handler);
	};

}

module.exports = TelegramBotClient;
