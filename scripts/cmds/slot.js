module.exports = {
  config: {
    name: "slot",
    version: "3.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    shortDescription: { en: "Slot game" },
    longDescription: { en: "Advanced Slot game with jackpot feature." },
    category: "game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win more!",
      not_enough_money: "Fokinni! Tui toh gorib, balance chack kor?! 😤",
      spin_message: "Spinning...",
      win_message: "💰!!𝗦𝗟𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧!!🎰"
        + "\n        "
        + "\n💥 𝑌𝑂𝑈 𝑊𝑂𝑁 𝑇𝐻𝐸 𝑆𝐿𝑂𝑇 🎊"
        + "\n~💸𝑊𝑂𝑁 𝑀𝑂𝑁𝐸𝑌💸: $%1"
        + "\n~𝐸𝑛𝑗𝑜𝑦💰!",
      lose_message: "💰!!𝗦𝗟𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧!!🎰"
        + "\n        "
        + "\n🥲 𝑌𝑂𝑈 𝐿𝑂𝑆𝑇 𝑇𝐻𝐸 𝑆𝐿𝑂𝑇 😷"
        + "\n~💸𝐿𝑂𝑆𝑇 𝑀𝑂𝑁𝐸𝑌💸: $%1"
        + "\n~𝐴𝑙𝑎𝑠💰!",
      jackpot_message: "💰 !!!𝗝𝗔𝗖𝗞𝗣𝗢𝗧!!! 🎰"
        + "\n        "
        + "\n💥 𝑌𝑂𝑈 𝑊𝑂𝑁 𝐽𝐴𝐶𝐾𝑃𝑂𝑇 🎊"
        + "\n~💸𝑊𝑂𝑁 𝑀𝑂𝑁𝐸𝑌💸: $%1"
        + "\n~𝑊𝑖𝑡ℎ 𝑓𝑜𝑢𝑟 %2 𝑠𝑦𝑚𝑏𝑙𝑒𝑠, 𝐸𝑛𝑗𝑜𝑦💰!",
    },
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }
    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["🍓", "🍆", "🍎", "🍌", "🍍", "🥭", "🫐", "🍊", "🍋", "🍒", "🥞", "🍔"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];
    const slot4 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, slot4, amount);
    await usersData.set(senderID, { money: userData.money + winnings });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, slot4, winnings, getLang);
    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, slot4, betAmount) {
  if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) {
    if (slot1 === "🍆" || slot1 === "🍍") return betAmount * 20; // বড় Jackpot!
    return betAmount * 10; // চারটি একই চিহ্ন হলে ১০x
  } 
  else if ((slot1 === slot2 && slot2 === slot3) || (slot2 === slot3 && slot3 === slot4)) {
    return betAmount * 5; // তিনটি মিললে ৫x
  } 
  else if (slot1 === slot2 || slot1 === slot3 || slot1 === slot4 || slot2 === slot3 || slot2 === slot4 || slot3 === slot4) {
    return betAmount * 3; // দুটি মিললে 3x pabe
  } 
  else {
    return -betAmount * 1; // কিছু না মিললে বাজির 1 গুণ হারাবে
  }
}

function getSpinResultMessage(slot1, slot2, slot3, slot4, winnings, getLang) {
  if (winnings > 0) {
    if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) {
      return getLang("jackpot_message", winnings, slot1);
    }
    return getLang("win_message", winnings) + `\n~𝐒𝐋𝐎𝐓'𝐒:\n[ ${slot1} | ${slot2} | ${slot3} | ${slot4} ]`;
  } else {
    return getLang("lose_message", -winnings) + `\n~𝐒𝐋𝐎𝐓'𝐒:\n[ ${slot1} | ${slot2} | ${slot3} | ${slot4} ]`;
  }
           }
