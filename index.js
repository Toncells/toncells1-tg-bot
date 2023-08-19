import TeleBot from 'telebot';
import dotenv from 'dotenv'
import request from 'request'
import fetch from 'node-fetch'
import dayjs from "dayjs"
dotenv.config()

var bot = new TeleBot({
  token: process.env.telekey,
  sleep: 1000, // How often check updates (in ms)
  timeout: 0, // Update pulling timeout (0 - short polling)
  limit: 100, // Limits the number of updates to be retrieved
  retryTimeout: 5000 // Reconnecting timeout (in ms)
});

bot.on('/view', function(msg) {
  var id = msg.from.id;
  return bot.sendMessage(id, 'Here is toncells map', {
    replyMarkup: {
      inline_keyboard: [
        [{ text: "open", web_app: { url: "https://app.toncells.org" } }],
      ]
    }
  }
  );
});

bot.on('/random', function(msg) {
  var id = msg.from.id;
  return request("https://app.toncells.org:9917/API/getRandArea", {
    encoding: null
  }, (e, res, buff) => {
    return bot.sendPhoto(id, Buffer.from(buff))
  })
});

bot.on('/start', function(msg) {
  var id = msg.from.id;
  return bot.sendMessage(id, 'Supported commands:\n /view\n /random\n /last_changes');
});

bot.on('/last_changes', function(msg) {
  var id = msg.from.id;


  fetch("https://app.toncells.org:9917/API/getStatus", {
    "headers": {
      "accept": "*/*",
    },
  }).then(e => e.json()).then(e => {
    const empty = '#1AB90C#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#1AB90C#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#1AB90C#1AB90C#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#FFFFFF#1AB90C#1AB90C'
    const sorted = (e.status.filter(e => (e['Time'] > 10) && e["Image"] && e['Image'] !== empty).sort((a, b) => b['Time'] - a['Time']))
    const ids = sorted.slice(0, 10).map(e => ([{ text: e.ID + ' / ' + dayjs(e.Time).format('HH:mm DD/MM/YYYY'), web_app: { url: `https://app.toncells.org/${e.ID}` } }]))

    bot.sendMessage(id, 'This is list of last 10 changes on the map:', {
      replyMarkup: {
        inline_keyboard: ids
      }
    })
  })
});

bot.connect();
