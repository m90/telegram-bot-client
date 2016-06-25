var assert = require('assert');
var Promise = require('promise');

var TelegramBotClient = require('./../index');

var CHAT_ID = process.env.TELEGRAM_ID || 89149957;
var TOKEN = process.env.TELEGRAM_TOKEN;

if (!TOKEN){
	throw new Error('Please set TELEGRAM_TOKEN before running the tests!');
}

describe('TelegramBotClient', function(){

	describe('Chain', function(){
		this.timeout(40000);
		var client = new TelegramBotClient(TOKEN);
		it('exposes all methods in an async chain', function(){
			return client
				.sendMessage(CHAT_ID, 'This is a test')
				.delay(12000)
				.sendMessage(CHAT_ID, 'I can wait')
				.promise();
		});
		it('can be unwrapped into a promise', function(){
			var p = client.sendMessage(CHAT_ID, 'Promises! ftw!').promise();
			assert(p instanceof Promise);
		});
		it('exposes a fake `.then`', function(done){
			var p = client.sendMessage(CHAT_ID, 'Promises! ftw!').then(function(res){
				assert(res.ok);
				done();
			});
		});
		it('passes errors down the chain', function(done){
			client
				.sendMessage(CHAT_ID)
				.delay(99000)
				.sendMessage(CHAT_ID, 'I can wait')
				.catch(function(err){
					assert(err);
					done();
				});
		});
	});

	describe('Standard Chat Methods', function(){

		describe('#sendMessage(chatId, text[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a message', function(){
				return client.sendMessage(CHAT_ID, 'Foo Bar!').promise();
			});
			it('rejects on missing arguments', function(done){
				client.sendMessage(CHAT_ID).catch(function(err){
					assert(err);
					done();
				});
			});
		});

		describe('#forwardMessage(chatId, fromChatId, messageId)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('forwards sent messages when passing an id', function(){
				return client.sendMessage(CHAT_ID, 'Forward Me!').promise().then(function(response){
					return client.forwardMessage(CHAT_ID, response.result.chat.id, response.result.message_id).promise();
				});
			});
			it('rejects on missing params', function(done){
				client.forwardMessage(CHAT_ID).catch(function(err){
					assert(err);
					done();
				});
			});
		});

		describe('#sendPhoto(chatId, photoReference[, options])', function(){
			this.timeout(25000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a photo using a local file', function(){
				return client.sendPhoto(CHAT_ID, './test/fixtures/pizzacat.jpg').promise();
			});
			it('sends a photo using a URL', function(){
				return client.sendPhoto(CHAT_ID, 'https://upload.wikimedia.org/wikipedia/commons/5/50/01-Magpie.jpg').promise();
			});
			it('resends photos using file identifiers', function(){
				return client.sendPhoto(CHAT_ID, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cyanocitta-cristata-004.jpg/1280px-Cyanocitta-cristata-004.jpg').promise().then(function(res){
					return client.sendPhoto(CHAT_ID, res.result.photo[0].file_id);
				});
			});
		});

		describe('#sendAudio(chatId, audioReference[, options])', function(){
			this.timeout(25000);
			var client = new TelegramBotClient(TOKEN);
			it('sends audio using a local file', function(){
				return client.sendAudio(CHAT_ID, './test/fixtures/bluejay.ogg').promise();
			});
			it('sends audio using a URL', function(){
				return client.sendAudio(CHAT_ID, 'https://upload.wikimedia.org/wikipedia/commons/7/72/Cyanocitta_cristata_-_Blue_Jay_-_XC109601.ogg').promise();
			});
		});

		describe('#sendVoice(chatId, voiceReference[, options])', function(){
			this.timeout(25000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a voice message using a local file', function(){
				return client.sendVoice(CHAT_ID, './test/fixtures/bluejay.ogg').promise();
			});
		});

		describe('#sendDocument(chatId, documentReference[, options])', function(){
			this.timeout(25000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a document using a local file', function(){
				return client.sendDocument(CHAT_ID, './test/fixtures/doc.txt').promise();
			});
		});

		describe('#sendSticker(chatId, stickerReference[, options])', function(){
			this.timeout(25000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a sticker using a local file', function(){
				return client.sendSticker(CHAT_ID, './test/fixtures/sticker.webp').promise();
			});
		});

		describe('#sendLocation(chatId, lat, lon[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a location by passing lat and lon', function(){
				return client.sendLocation(CHAT_ID, 52.520007, 13.404954).promise();
			});
			it('rejects on missing params', function(done){
				client.sendLocation(CHAT_ID, 52.520007).catch(function(err){
					assert(err);
					done();
				});
			});
		});

		describe('#sendVenue(chatId, lat, lon, title, address[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a location by passing lat, lon, title, address', function(){
				return client.sendVenue(CHAT_ID, 52.551110, 13.331278, 'Volkspark Rehberge', 'Windhuker Str. 52A, 13351 Berlin').promise();
			});
		});

		describe('#sendContact(chatId, phoneNumber, firstName[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sends a contact', function(){
				return client.sendContact(CHAT_ID, '1-800-I-CAN-SUE', 'John', { last_name: 'Doe' }).promise();
			});
		});


		describe('#sendChatAction(chatId, action)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sends chat actions', function(){
				return client.sendChatAction(CHAT_ID, 'typing').promise();
			});
		});

		describe('#getMe()', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('gets infos about the bot', function(){
				return client.getMe().promise().then(function(res){
					assert(res.result.id);
				});
			});
		});

		describe('#getChat(chatId)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('gets infos about the bot', function(){
				return client.getChat(CHAT_ID).promise().then(function(res){
					assert(res.result.id);
				});
			});
		});

		describe('#getChatAdministrators(chatId)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('gets infos about the bot', function(){
				return client.getChatAdministrators(CHAT_ID).promise().then(function(res){
					assert(res.result);
					assert(Array.isArray(res.result));
				});
			});
		});

		describe('#getChatMembersCount(chatId)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('gets infos about the bot', function(){
				return client.getChatMembersCount(CHAT_ID).promise().then(function(res){
					assert(res.result);
					assert(isFinite(res.result));
				});
			});
		});

		describe('#getUpdates([options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('gets updates for the bot', function(){
				return client.getUpdates().promise().then(function(res){
					assert(typeof res.result.length !== 'undefined');
				});
			});
		});

		describe('#setWebhook(url)', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('sets webhook values', function(){
				return client.setWebhook('123.123.123.123').promise().then(function(res){
					assert.equal(res.result, true);
				});
			});
			it('rejects invalid values', function(done){
				client.setWebhook('this is not a url').catch(function(err){
					assert(err);
					done();
				});
			});
			it('unsets webhook values', function(){
				return client.setWebhook('').promise().then(function(res){
					assert.equal(res.result, true);
				});
			});

		});

	});

	describe('Message Editing', function(){
		describe('#editMessageText([chat_id, ]identifier, text[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('edits a sent message\'s text', function(){
				return client.sendMessage(CHAT_ID, 'This message should not contain tpyos').promise().then(function(response){
					return client.editMessageText(CHAT_ID, response.result.message_id, 'This message should not contain typos').promise().then(function(response){
						assert(response.result.text.indexOf('typo') > -1);
					});
				});
			});
		});
		describe('#editMessageCaption([chat_id, ]identifier[, options])', function(){
			this.timeout(10000);
			var client = new TelegramBotClient(TOKEN);
			it('edits a sent message\'s caption', function(){
				return client.sendPhoto(CHAT_ID, './test/fixtures/pizzacat.jpg', { caption: 'Pizza Cat?' }).promise().then(function(response){
					return client.editMessageCaption(CHAT_ID, response.result.message_id, { caption: 'Pizza Cat!' }).promise().then(function(response){
						assert(response.result.caption.indexOf('!') > -1);
					});
				});
			});
		});
	});

});
