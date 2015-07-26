# telegram-bot-client

[![Build Status](https://travis-ci.org/m90/telegram-bot-client.svg?branch=master)](https://travis-ci.org/m90/telegram-bot-client)

> node.js client for the [Telegram messenger Bot API](https://core.telegram.org/bots/api)

### Installation
Install via npm:

```sh
$ npm install telegram-bot-client --save
```

### Usage
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

### Available methods:

All [currently supported methods](https://core.telegram.org/bots/api#available-methods) are present on the client.

### License
MIT © [Frederik Ring](http://www.frederikring.com)
