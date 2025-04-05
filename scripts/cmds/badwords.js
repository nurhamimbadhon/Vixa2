module.exports = {
  config: {
    name: "badwords",
    aliases: ["badword"],
    version: "0.1",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 5,
    role: 1,
    description: {
      en: "Manage bad words and emojis in the chat. If a user violates 3 times, they will be removed."
    },
    category: "box chat",
    guide: {
      en: "{pn} add <words>\n{pn} delete <words>\n{pn} emoji add <emoji>\n{pn} emoji delete <emoji>\n{pn} list\n{pn} emoji list\n{pn} on/off\n{pn} unwarn <@tag>"
    }
  },

  onStart: async function ({ message, event, args, threadsData, usersData, role }) {
    let threadData = await threadsData.get(event.threadID, "data.badWords", { words: [], emojis: [], violationUsers: {} });

    switch (args[0]) {
      case "add": {
        if (role < 1) return message.reply("⚠️ | Only group administrators can add banned words.");
        let words = args.slice(1).join(" ").split(/[,|]/).map(word => word.trim()).filter(word => word.length >= 2);
        if (words.length === 0) return message.reply("⚠️ | You haven't entered a valid word.");

        let newWords = words.filter(word => !threadData.words.includes(word));
        if (newWords.length === 0) return message.reply("⚠️ | These words are already in the banned list.");

        threadData.words.push(...newWords);
        await threadsData.set(event.threadID, threadData, "data.badWords");
        return message.reply(`✅ | ${newWords.length} words added to the banned words list.`);
      }

      case "emoji": {
        if (!args[1]) return message.reply("⚠️ | Invalid usage! Use: {pn} emoji [add | delete] <emojis>");
        let emojis = args.slice(2).join(" ").split(/[,|]/).map(e => e.trim()).filter(e => e.length > 0);

        if (args[1] === "add") {
          if (role < 1) return message.reply("⚠️ | Only group administrators can add banned emojis!");
          let newEmojis = emojis.filter(e => !threadData.emojis.includes(e));
          if (newEmojis.length === 0) return message.reply("❌ | These emojis are already in the banned list!");

          threadData.emojis.push(...newEmojis);
          await threadsData.set(event.threadID, threadData, "data.badWords");
          return message.reply(`✅ | ${newEmojis.length} emojis added to the banned emojis list.`);
        }

        if (args[1] === "delete") {
          if (role < 1) return message.reply("⚠️ | Only group administrators can remove banned emojis.");
          let removedEmojis = emojis.filter(e => threadData.emojis.includes(e));
          threadData.emojis = threadData.emojis.filter(e => !removedEmojis.includes(e));
          await threadsData.set(event.threadID, threadData, "data.badWords");

          return message.reply(`✅ | ${removedEmojis.length} emojis removed from the banned list.`);
        }
      }

      case "list": {
        let wordList = threadData.words.length > 0 ? `📑 | BAD WORDS: ${threadData.words.join(", ")}` : "⚠️ | The banned words list is empty.";
        let emojiList = threadData.emojis.length > 0 ? `📃 | BAD EMOJIS: ${threadData.emojis.join(", ")}` : "⚠️ | The banned emojis list is empty.";
        return message.reply(`${wordList}\n\n${emojiList}`);
      }

      case "on":
      case "off": {
        if (role < 1) return message.reply("⚠️ | Only group administrators can enable/disable this feature.");
        let status = args[0] === "on";
        await threadsData.set(event.threadID, status, "settings.badWords");
        return message.reply(`✅ | Bad words/emojis filter has been turned ${status ? "ON" : "OFF"} for this group.`);
      }

      case "unwarn": {
        if (role < 1) return message.reply("⚠️ | Only group administrators can remove warnings.");
        let userID = Object.keys(event.mentions)[0] || args[1];
        if (!userID) return message.reply("⚠️ | Please tag a user or provide a valid user ID.");

        if (!threadData.violationUsers[userID]) return message.reply("⚠️ | This user has no warnings.");
        delete threadData.violationUsers[userID];

        await threadsData.set(event.threadID, threadData, "data.badWords");
        let userName = await usersData.getName(userID);
        return message.reply(`✅ | Successfully removed warning for ${userName}.`);
      }
    }
  },

  onChat: async function ({ message, event, api, threadsData, usersData }) {
    if (!event.body) return;
    let threadData = await threadsData.get(event.threadID, "data.badWords", { words: [], emojis: [], violationUsers: {} });
    let isEnabled = await threadsData.get(event.threadID, "settings.badWords", false);
    if (!isEnabled || (threadData.words.length === 0 && threadData.emojis.length === 0)) return;

    let wordsFound = threadData.words.filter(word => new RegExp(`\\b${word}\\b`, "i").test(event.body));
    let emojisFound = threadData.emojis.filter(emoji => event.body.includes(emoji));

    if (wordsFound.length > 0 || emojisFound.length > 0) {
      let userID = event.senderID;
      threadData.violationUsers[userID] = (threadData.violationUsers[userID] || 0) + 1;
      await threadsData.set(event.threadID, threadData, "data.badWords");

      if (threadData.violationUsers[userID] >= 4) {
        let userName = await usersData.getName(userID);
        message.reply(`⚠️ | ${userName} has been removed from the group due to repeated violations.`);
        return api.removeUserFromGroup(userID, event.threadID, err => {
          if (err) return message.reply("⚠️ | The bot needs admin permissions to remove users.");
        });
      }

      let warningCount = threadData.violationUsers[userID];
      return message.reply(`⚠️ | Banned words/emojis "${[...wordsFound, ...emojisFound].join(", ")}" has been detected to your message! You have violated ${warningCount} times. If you reach 4 violations, you will be removed from the group.`);
    }
  }
};
