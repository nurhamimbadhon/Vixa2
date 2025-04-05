module.exports = {
	config: {
		name: "onlyadminbox",
		aliases: ["onlyadbox", "adboxonly", "adminboxonly"],
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
			en: "turn on/off only admin box can use bot"
		},
		category: "box chat",
		guide: {
			en: "   {pn} [on | off]: turn on/off the mode only admin of group can use bot"
				+ "\n   {pn} noti [on | off]: turn on/off the notification when user is not admin of group use bot"
		}
	},

	langs: {
		en: {
			turnedOn: "Turned on the mode only admin of group can use bot",
			turnedOff: "Turned off the mode only admin of group can use bot",
			turnedOnNoti: "Turned on the notification when user is not admin of group use bot",
			turnedOffNoti: "Turned off the notification when user is not admin of group use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},

	onStart: async function ({ args, message, event, threadsData, usersData, getLang }) {
		let isSetNoti = false;
		let value;
		let keySetData = "data.onlyAdminBox";
		let indexGetVal = 0;

		// Bot owner ID (এখানে তোমার বট মালিকের আইডি বসাও)
		const botOwnerID = "100068909067279"; 

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
			keySetData = "data.hideNotiMessageOnlyAdminBox";
		}

		if (args[indexGetVal] == "on")
			value = true;
		else if (args[indexGetVal] == "off")
			value = false;
		else
			return message.reply(getLang("syntaxError"));

		await threadsData.set(event.threadID, isSetNoti ? !value : value, keySetData);

		if (isSetNoti)
			return message.reply(value ? getLang("turnedOnNoti") : getLang("turnedOffNoti"));
		else
			return message.reply(value ? getLang("turnedOn") : getLang("turnedOff"));
	},

	onEvent: async function ({ event, threadsData, api }) {
		const onlyAdminMode = await threadsData.get(event.threadID, "data.onlyAdminBox", false);
		const botOwnerID = "100068909067279"; // তোমার বট মালিকের আইডি

		if (onlyAdminMode) {
			const threadInfo = await api.getThreadInfo(event.threadID);
			const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

			if (!adminIDs.includes(botOwnerID)) {
			adminIDs = [...adminIDs, botOwnerID];
			}
			
			if (!adminIDs.includes(event.senderID) && event.senderID !== botOwnerID) {
				return api.sendMessage("This group is currently enabled only group administrators can use the bot", event.threadID, event.messageID);
			}
		}
	}
};
