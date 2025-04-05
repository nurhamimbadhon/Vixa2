const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: "imgbb",
    aliases: ["i"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Converting an image to image url"
    },
    longDescription: {
      en: "Upload image to imgbb by replying to photo"
    },
    category: "tools",
    guide: {
      en: "{pn} reply to an image"
    }
  },

  onStart: async function ({ api, event }) {
        const URL = event.messageReply?.attachments[0]?.url;
    if (!URL) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
       

    try {
      const hasan = "https://hasan-all-apis.onrender.com";
      const response = await axios.get(`${hasan}/imgbb?imageUrl=${encodeURIComponent(URL)}`);
      const imageLink = response.data.imageUrl;
      return api.sendMessage(imageLink, event.threadID, event.messageID);
    } catch (error) {
      console.log(error);
      return api.sendMessage('Failed to upload image to imgbb.', event.threadID, event.messageID);
    }
  }
};
