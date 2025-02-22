import TeleBot from 'telebot';
import dotenv from 'dotenv'
dotenv.config()

var bot = new TeleBot({
  token: process.env.telekey,
  sleep: 1000, // How often check updates (in ms)
  timeout: 0, // Update pulling timeout (0 - short polling)
  limit: 100, // Limits the number of updates to be retrieved
  retryTimeout: 5000 // Reconnecting timeout (in ms)
});

bot.on('/start', function(msg) {
  var id = msg.from.id;
  return bot.sendMessage(id, `
----editable nft collection----

it is a field of cells (v1 includes 10,000 cells, while v2 includes 1,600 cells). each cell is a unique nft on ton. you can mint an nft and customize it however you wish. the image from this nft will be displayed on the main field. additionally, you can edit both the description and the name of your nft simply by clicking on the cell.

history:
* toncells v1 was archived on 21.12.2024
* toncells v2 launched on 03.12.2023
* toncells v1 launched on 22.03.2022`, {
    replyMarkup: {
      inline_keyboard: [
        [{ text: "Open toncells v2 app", web_app: { url: "https://app.toncells.org" } }],
      ]
    }
  }
  );
});

bot.connect();
