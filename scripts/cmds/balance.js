module.exports = {
    config: {
        name: "balance",
        aliases: ["bal"],
        version: "1.5",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        description: {
            en: "📊 | View your money or the money of the tagged person.And send or request for money"
        },
        category: "economy",
        guide: {
            en: "   {pn}: view your money 💰"
                + "\n   {pn} <@tag>: view the money of the tagged person 💵"
                + "\n   {pn} send [amount] @mention: send money to someone 💸"
                + "\n   {pn} request [amount] @mention: request money from someone 💵"
        }
    },

    formatMoney: function (amount) {
        if (!amount) return "0";
        if (amount >= 1e33) return (amount / 1e33).toFixed(1) + 'Dc';
        if (amount >= 1e30) return (amount / 1e30).toFixed(1) + 'No';
        if (amount >= 1e27) return (amount / 1e27).toFixed(1) + 'Oc';
        if (amount >= 1e24) return (amount / 1e24).toFixed(1) + 'Sp';
        if (amount >= 1e21) return (amount / 1e21).toFixed(1) + 'Sx';
        if (amount >= 1e18) return (amount / 1e18).toFixed(1) + 'Qn';
        if (amount >= 1e15) return (amount / 1e15).toFixed(1) + 'Q';
        if (amount >= 1e12) return (amount / 1e12).toFixed(1) + 'T';
        if (amount >= 1e9) return (amount / 1e9).toFixed(1) + 'B';
        if (amount >= 1e6) return (amount / 1e6).toFixed(1) + 'M';
        if (amount >= 1e5) return (amount / 1e5).toFixed(1) + 'Lakh';
        if (amount >= 1e3) return (amount / 1e3).toFixed(1) + 'K';
        return amount.toString();
    },

    onStart: async function ({ message, usersData, event, args, api }) {
        let targetUserID = event.senderID;
        let isSelfCheck = true;

        if (event.messageReply) {
            targetUserID = event.messageReply.senderID;
            isSelfCheck = false;
        } 
        else if (event.mentions && Object.keys(event.mentions).length > 0) {
            targetUserID = Object.keys(event.mentions)[0];
            isSelfCheck = false;
        }

        if (args.length > 0 && (args[0] === "send" || args[0] === "request")) {
            return await this.handleTransaction({ message, usersData, event, args, api });
        }

        const userData = await usersData.get(targetUserID);
        const money = userData?.money || 0;
        const formattedMoney = this.formatMoney(money);

        if (isSelfCheck) {
            return message.reply(`💰 𝑌𝑜𝑢𝑟 𝐵𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 ${formattedMoney} $ 🤑`);
        } 
        else {
            return message.reply(`💳 𝑩𝑨𝑳𝑨𝑵𝑪𝑬 𝑰𝑵𝑭𝑶 💳\n💰 ${userData?.name || "𝑈𝑠𝑒𝑟"} - 𝐻𝑎𝑠 ${formattedMoney} $ 💸\n💫 𝐻𝑎𝑣𝑒 𝑎 𝑔𝑜𝑜𝑑 𝑑𝑎𝑦 💫`);
        }
    },

    handleTransaction: async function ({ message, usersData, event, args, api }) {
        const command = args[0].toLowerCase();
        const amount = parseInt(args[1]);
        const { senderID, threadID, mentions, messageReply } = event;
        let targetID;

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage(`❌ | Invalid amount! Usage:\n{pn} send [amount] @mention\n{pn} request [amount] @mention`, threadID);
        }

        if (messageReply) {
            targetID = messageReply.senderID;
        } else {
            const mentionKeys = Object.keys(mentions);
            if (mentionKeys.length === 0) {
                return api.sendMessage("❌ | Mention someone to send/request money!", threadID);
            }
            targetID = mentionKeys[0];
        }

        if (!targetID || targetID === senderID) {
            return api.sendMessage("❌ | You cannot send/request money to yourself!", threadID);
        }

        if (command === "send") {
            const senderData = await usersData.get(senderID);
            const receiverData = await usersData.get(targetID);

            if (!senderData || !receiverData) {
                return api.sendMessage("❌ | User not found.", threadID);
            }

            if (senderData.money < amount) {
                return api.sendMessage("❌ | You don't have enough money!", threadID);
            }

            await usersData.set(senderID, { ...senderData, money: senderData.money - amount });
            await usersData.set(targetID, { ...receiverData, money: receiverData.money + amount });

            const senderName = await usersData.getName(senderID);
            const receiverName = await usersData.getName(targetID);

            api.sendMessage(`✅ | ${senderName} Send you ${this.formatMoney(amount)} $ ! 💸`, targetID);
            return api.sendMessage(`✅ | You successfully send ${this.formatMoney(amount)} $ To ${receiverName}`, threadID);
        }

        if (command === "request") {
            const requesterName = await usersData.getName(senderID);
            const targetName = await usersData.getName(targetID);

            api.sendMessage(`📩 | ${requesterName} তোমার কাছ থেকে ${this.formatMoney(amount)} টাকা চাইছে! 💵\nপাঠাতে "{pn} send ${amount} @${requesterName}" ব্যবহার করো।`, targetID);
            return api.sendMessage(`📩 | তুমি ${targetName}-এর কাছে ${this.formatMoney(amount)} টাকা চেয়েছো!`, threadID);
        }
    }
};
