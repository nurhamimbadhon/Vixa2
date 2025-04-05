module.exports = {
  config: {
    name: "shortmassage",
    version: "1.0",
    author: "Hasan", 
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "no prefix",
  },

  onStart: async function () {},

  onChat: async function ({ event, message, getLang }) {
    const text = event.body && event.body.toLowerCase();

    if (text === "assalamualaikum") {
      return message.reply({
        body: `
 ~Walaikum assalam ✨💫🥳`,
      });
    }

    if (text === "good morning") {
      return message.reply({
        body: `
 ~Good morning too ☺️✨ `,
      });
    }

    if (text === "good night") {
      return message.reply({
        body: `
 Good night 🐸
~And have a sweet dream with me👀😘`,
      });
    }

    if (text === "intro sajid") {
      return message.reply({
        body: `
Name: Sajid [Admin]
Class: SSC25  [science]
Address: Savar
Age: 17
Blood: O+
Weight: 50
Height: 5'9
Birthday: 11 December 2007
𝙎𝙞𝙣𝙜𝙡𝙚 𝙑𝙞𝙧𝙜𝙞𝙣 𝙪𝙡𝙩𝙧𝙖 𝙥𝙧𝙤 𝙢𝙖𝙭`,
        attachment: await global.utils.getStreamFromURL("https://i.imgur.com/DV2iCBd.jpeg")
      });
    }

    if (text === "bye") {
      return message.reply({
        body: `
~ Allah hafeez! Take care✨ `,
      });
    }

    if (text === "allah hafeez") {
      return message.reply({
        body: `
~ Allah hafeez too 😘💫`,
      });
    }

    if (text === "assalamualaikum all") {
      return message.reply({
        body: `
~ Walaikum assalam ✨🫀`,
      });
    }

    if (text === "bye all") {
      return message.reply({
        body: `
 Bye! Take care 💗`,
      });
    }

    if (text === "allah hafeez all") {
      return message.reply({
        body: `
~ Allah hafeez ✨🫀`,
      });
    }

    if (text === "good night all") {
      return message.reply({
        body: `
 Good night 💫🫀`,
      });
    }

    if (text === "shan") {
      return message.reply({
        body: `
~ Ore dako kno !? ummmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmaaaaaaaaaaaaaaaaaaahhhhhhhhh 😘💋👀`,
      });
    }
    if (text === "faizo") {
      return message.reply({
        body: `
 Yes!? i am the lord of toxic 💀✌️`,
      });
    }
    if (text === "hi") {
      return message.reply({
        body: `
ummmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmaaaaaaaaaaaaaaaaaaahhhhhhhhh bby 💗🫀`,
      });
    }
  },
};
