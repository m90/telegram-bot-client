# telegram-bot-client

[![Build Status](https://travis-ci.org/m90/telegram-bot-client.svg?branch=master)](https://travis-ci.org/m90/telegram-bot-client)

> node.js client for the [Telegram messenger Bot API](https://core.telegram.org/bots/api)

### Installation
Install via npm:

```sh
$ npm install telegram-bot-client --save
```

### Usage
**Important:** Please note that this client does not and will not support automated polling or listening to webhooks. This can be done much better by the application running the bot. If you are interested in how this might look like you can have a look at [telegram-bot-boilerplate](https://github.com/m90/telegram-bot-boilerplate).

Instantiate a new client using your bot's token:

```js
var TelegramBotClient = require('telegram-bot-client');
var client = new TelegramBotClient(MY_TOKEN);
client.sendMessage(CHAT_ID, 'I\'m a bot, so what?');
```

All methods on the client are chainable and will wait for the previous operations to finish:

```js
client
    .sendMessage(CHAT_ID, 'Hi!')
    .sendMessage(CHAT_ID, 'How are you?')
    .sendMessage(CHAT_ID, 'Be right back!')
    .delay(25000)
    .sendMessage(CHAT_ID, 'Back!')
    .sendMessage(CHAT_ID, 'Wait, I want to show you something, where is it?')
    .delay(7500)
    .sendPhoto(CHAT_ID, SOME_URL_POINTING_TO_A_PHOTO)
    .sendMessage(CHAT_ID, 'How do you like it?')
    .catch(function(err){
        // all errors ocurring in the above call chain
        // will be passed down to this handler
        console.log(err);
    });
```

If you want to consume the response you can unwrap the chain using the `.promise()` method:

```js
client
    .sendMessage(CHAT_ID, 'Did this really work?')
    .promise()
    .then(function(response){
        console.log(response);
    }, function(err){
        console.log(err);
    });
```

### Passing optional arguments:

All methods are following the same convention: Required arguments are passed seperately, all optional parameters can be wrapped into an object and be supplied as the method's last argument:

```js
var messageText = 'Look at this: https://www.youtube.com/watch?v=qb_hqexKkw8';
var opts = { disable_web_page_preview: true };
client.sendMessage(CHAT_ID, messageText, opts);
```

### Available methods:

All [methods described by the API docs](https://core.telegram.org/bots/api#available-methods) are present on the client.

##### `#getMe()`
gets info on the bot

##### `#getUpdates([options])`
gets updates (messages) sent to the bot

##### `#getUserProfilePhotos(userId[, options])`
gets a user's profile photos
- userId: the user's id

##### `#setWebhook(url)`
sets or removes the webhook url to use
- url: the url, to remove the webhook pass `''`

##### `#sendMessage(chatId, text[, options])`
sends a message
- chatId: the chat's id
- text: the message to send

##### `#forwardMessage(chatId, fromChatId, messageId)`
forwards a message
- chatId: the chat's id
- fromChatId: the id of the chat the message is forwarded from
- messageId: the message's id

##### `#sendPhoto(chatId, photoReference[, options])`
sends a photo
- chatId: the chat's id
- photoReference: this can be a local file path, a URL or a telegram file id

##### `#sendAudio(chatId, audioReference[, options])`
sends audio
- chatId: the chat's id
- audioReference: this can be a local file path, a URL or a telegram file id

##### `#sendVoice(chatId, voiceReference[, options])`
sends audio
- chatId: the chat's id
- voiceReference: this can be a local file path or a telegram file id

##### `#sendDocument(chatId, documentReference[, options])`
sends a document
- chatId: the chat's id
- documentReference: this can be a local file path, a URL or a telegram file id

##### `#sendSticker(chatId, stickerReference[, options])`
sends a sticker
- chatId: the chat's id
- stickerReference: this can be a local file path, a URL or a telegram file id

##### `#sendVideo(chatId, videoReference[, options])`
sends video
- chatId: the chat's id
- videoReference: this can be a local file path, a URL or a telegram file id

##### `#sendLocation(chatId, lat, lon[, options])`
sends a location
- chatId: the chat's id
- lat: latitude
- lon: longitude

##### `#sendVenue(chatId, lat, lon, title, address[, options])`
sends a venue
- chatId: the chat's id
- lat: latitude
- lon: longitude
- title: title of the venue
- address: address of the venue

##### `#sendContact(chatId, phoneNumber, firstName[, options])`
sends a contact
- chatId: the chat's id
- phoneNumber: the contact's phone number
- firstName: the contact's first name

##### `#sendChatAction(chatId, action)`
sends a chat action
- chatId: the chat's id
- action: the action to send

##### `#kickChatMember(chatId, userId)`
kicks a user from a chat
- chatId: the chat's id
- userId: the user id to ban

##### `#unbanChatMember(chatId, userId)`
unbans a previously kicked user
- chatId: the chat's id
- userId: the user id to unban

##### `#answerCallbackQuery(callbackQueryId[, options])`
answer callback queries sent by inline keyboards
- callbackQueryId: the id of the callback query

##### `#editMessageText([chatId,] identifier, text[, options])`
edit a message's text
- chatId: the chat's id
- identifier: message or inline message id
- text: the updated text

##### `#editMessageCaption([chatId,] identifier[, options])`
edit a message's caption
- chatId: the chat's id
- identifier: message or inline message id

##### `#editMessageReplyMarkup([chatId,] identifier[, options])`
edit a message's reply markup
- chatId: the chat's id
- identifier: message or inline message id

##### `#answerInlineQuery(inlineQueryId, results[, options])`
answer an inline query
- inlineQueryId: the inline query's id
- results: a string containing a JSON version of the results in an array

##### `#getChat(chatId)`
get information on a chat
- chatId: the chat's id

##### `#getChatAdministrators(chatId)`
get the administrators of a chat
- chatId: the chat's id
-
##### `#getChatMembersCount(chatId)`
get the number of members of a chat
- chatId: the chat's id

##### `#getChatMember(chatId, memberId)`
get information on a member of a chat
- chatId: the chat's id
- userId: the chat's id

##### `#leaveChat(chatId)`
leave a chat
- chatId: the chat's id

### Additional methods:

##### `#delay(duration)`
pauses the queue for the give duration
- duration: the time to pause in ms

##### `#promise()`
unwraps the chain and returns a promise for the last operation

##### `#then(successHandler, errorHandler)`
exposes the last operation's result via a promise interface
- successHandler: handler being passed the result
- errorHandler: handler being passed the error

##### `#catch(handler)`
handles errors occured in the chain
- handler: error handler function



### License
MIT © [Frederik Ring](http://www.frederikring.com)
