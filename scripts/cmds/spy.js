const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/KingsOfToxiciter/YouTube-Download/refs/heads/main/hasan.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "spy",
    aliases: ["whoishe", "whoisshe", "whoami", "atake"],
    version: "1.0",
    role: 0,
    author: "Dipto",
    Description: "Get user information and profile photo",
    category: "info",
    countDown: 10,
  },

  onStart: async function ({
    event,
    message,
    usersData,
    api,
    args,
  }) {
    const uid1 = event.senderID;

    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }
    const response = await require("axios").get(
      `${await baseApiUrl()}/baby?list=all`
    );
    const dataa = response.data || { teacher: { teacherList: [] } };
    let babyTeach = 0;

    if (dataa?.teacher?.teacherList?.length) {
      babyTeach = dataa.teacher.teacherList.find((t) => t[uid])?.[uid] || 0;
    }

    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);

    let genderText;
    switch (userInfo[uid].gender) {
      case 1:
        genderText = "𝐺𝑖𝑟𝑙🙋🏻‍♀️";
        break;
      case 2:
        genderText = "𝐵𝑜𝑦🙋🏻‍♂️";
        break;
      default:
        genderText = "𝐺𝑎𝑦🤷🏻‍♂️";
    }

    const money = (await usersData.get(uid)).money;
    const allUser = await usersData.getAll(), rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1, moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;

    const position = userInfo[uid].type;

    const userInformation = `
╭────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
├‣ 𝑵𝒂𝒎𝒆: ${userInfo[uid].name}
├‣ 𝑮𝒆𝒏𝒅𝒆𝒓: ${genderText}
├‣ 𝑼𝑰𝑫: ${uid}
├‣ 𝑪𝒍𝒂𝒔𝒔: ${position ? position?.toUpperCase() : "𝙽𝚘𝚛𝚖𝚊𝚕 𝚄𝚜𝚎𝚛🥺"}
├‣ 𝑼𝒔𝒆𝒓𝒏𝒂𝒎𝒆: ${userInfo[uid].vanity ? userInfo[uid].vanity : "𝙽𝚘𝚗𝚎"}
├‣ 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝑼𝒓𝒍: ${userInfo[uid].profileUrl}
├‣ 𝑩𝒊𝒓𝒕𝒉𝒅𝒂𝒚: ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"}
├‣ 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰‣ 𝑭𝒓𝒊𝒆𝒏𝒅 𝑾𝒊𝒕𝒉 𝑩𝒐𝒕: ${userInfo[uid].isFriend ? "𝚈𝚎𝚜✅" : "𝙽𝚘❎"}

╭─────[ 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 ]
├‣ 𝑴𝒐𝒏𝒓𝒚: $${formatMoney(money)}
├‣ 𝑹𝒂𝒏𝒌: #${rank}/${allUser.length}
├‣ 𝑴𝒐𝒏𝒆𝒚 𝑹𝒂𝒏𝒌: #${moneyRank}/${allUser.length}
╰‣ 𝑩𝒂𝒃𝒚 𝑻𝒆𝒂𝒄𝒉: ${babyTeach || 0}`;

    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  },
};

function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
        }
