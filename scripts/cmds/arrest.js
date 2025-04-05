const Jimp = require("jimp");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "arrest",
        aliases: ["ar"],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        shortDescription: "arrest",
        longDescription: "Arrest the rapist",
        category: "fun",
        guide: "{pn} tag or reply"
    },

    onStart: async function ({ api, message, event, usersData }) {
        const uid = event.senderID;
        const mention = Object.keys(event.mentions);
        const uid1 = Object.keys(event.mentions)[0];
        const uid2 = event.messageReply ? event.messageReply.senderID : null;
        const uids = uid1 || uid2;
           if (!uids) return message.reply("😤 | Tag or reply to someone you want to arrest.");
             let two = uid, one = uids;
      
              if (mention.length === 2) {
                     one = mention[1];
                     two = mention[0];
              }

 

        try {
            const avatarURL1 = await usersData.getAvatarUrl(one);
            const avatarURL2 = await usersData.getAvatarUrl(two);

            if (!avatarURL1 || !avatarURL2) {
                return message.reply("Couldn't fetch user avatars.");
            }

            // ছবি ডাউনলোড করা
            const avatar1 = await Jimp.read((await axios({ url: avatarURL1, responseType: "arraybuffer" })).data);
            const avatar2 = await Jimp.read((await axios({ url: avatarURL2, responseType: "arraybuffer" })).data);
            
            // ব্যাকগ্রাউন্ড সেট করা (কাস্টম ব্যাকগ্রাউন্ড ইউআরএল)
            const background = await Jimp.read("https://i.ibb.co/LXG5dGRZ/image.jpg");

            // ব্যাকগ্রাউন্ড রিসাইজ
            background.resize(645, 475);
            
            // অ্যাভাটার রাউন্ড করা এবং যোগ করা
            avatar1.resize(100, 100).circle();
            avatar2.resize(110, 110).circle();
            
            background.composite(avatar1, 175, 50);  // প্রথম ইউজারের ইমেজ বসানো
            background.composite(avatar2, 375, 20);  // দ্বিতীয় ইউজারের ইমেজ বসানো
            
            // ফাইল সেভ করা
            const imagePath = path.join(__dirname, "tmp", `${one}_${two}_kiss.png`);
            await background.writeAsync(imagePath);

            // পাঠানো
            message.reply({
                body: "⚠️ | You are under arrest !?",
                attachment: fs.createReadStream(imagePath)
            }, () => fs.unlinkSync(imagePath));
            
        } catch (error) {
            console.error(error);
            message.reply("Something went wrong while generating the image.");
        }
    }
};
