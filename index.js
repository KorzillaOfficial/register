const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client({ fetchAllMembers: true });
const fs = require("fs");
const config = client.config = require("./config.json");
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
moment.locale("tr");
const mongoose = require("mongoose");
mongoose.connect(config.mongooseConnectURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(x => console.log("MongoDB bağlantısı kuruldu!")).catch(err => console.error(err));
mongoose.connection.on('error', (err) => {
  console.log(`[Mongoose Error]: ${err}`);
});

Array.prototype.clear = function() {
  let newArray = [];
  for (let i of this) {
   if (!newArray.includes(i) && i !== "" && i !== " ") newArray.push(i);
  };
  return newArray;
};

Date.prototype.toTurkishFormat = function() {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

const events = fs.readdirSync("./events");
for (let event of events) {
  if (!event.endsWith(".js")) continue;
  let prop = require(`./events/${event}`);
  if (!prop.config) continue;
  if (prop.config.name !== "ready") {
    client.on(prop.config.name, prop);
  } else {
    client.on(prop.config.name, () => prop(client));
  };
  console.log(`[EVENT]: ${event} yüklendi!`);
};

client.commands = new Collection();
client.aliases = new Collection();
const commands = fs.readdirSync("./commands");
for (let command of commands) {
  if (!command.endsWith(".js")) continue;
  let prop = require(`./commands/${command}`);
  client.commands.set(prop.config.name, prop);
  if (prop.config.aliases) {
    prop.config.aliases.clear().forEach(aliase => {
      client.aliases.set(aliase, prop.config.name);
    });
  };
  console.log(`[KOMUT]: ${prop.config.name} yüklendi!`);
};

client.on('guildMemberAdd', async miaf => {

  const serendia = config.sunucuid

  const piece = config.kayitKanal;

  client.guilds.cache.get(serendia).channels.cache.get(piece).send(`

  • ${miaf} sunucumuza hoş geldin. Seninle beraber **${miaf.guild.memberCount}** kişiye ulaştık :tada:

  • Hesabınızın kuruluş tarihi: **${moment(miaf.user.createdAt).format('DD/MM/YYYY | HH:mm:ss')}**

  • Sesli odalara girerek kaydınızı yaptırabilirsiniz. <@&${config.teyitci}> sizinle ilgilenecektir.

  `)
});

client.on("guildMemberAdd", member => {
  member.roles.add('811978796609568778') //unregister rol id
  return member.guild.channels.cache.get("811978893707051039").send(`${member} Adlı Üye Aramıza Katıldı ona <@&811978796609568778> Rolünü Verdim`) //kanal id //unregister rol id
})




  client.on("message", async message => {
    if(message.author.id !== '786545911047389194')  return; //bot sahibi id 
    if (message.content === "mylorkatıl") {
    message.delete()
  client.emit(
    "guildMemberAdd",
    message.member || (await message.guild.fetchMember(message.author))
  );
}
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'tag') {
    msg.channel.send('Tagımız : .!.');
  }
  if (msg.content.toLowerCase() === '!tag') {
    msg.channel.send('Tagımız : .!.');
  }
});


var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => { console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted'))); });
client.on('error', e => { console.log(chalk.bgRed(e.replace(regToken, 'that was redacted'))); });

client.login(config.botToken).then(x => console.log(`${client.user.tag} olarak bota giriş yapıldı!`)).catch(err => console.error(`Bota giriş yapılamadı!\n[HATA]: ${err}`));