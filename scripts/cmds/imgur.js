const axios = require('axios');

module.exports = {
    config: {
        name: "imgur",
        version: "1.0",
        role: 0,
        author: "♡ 𝐻𝐴𝑆𝐴𝑁 ♡",
        shortDescription: "imgur upload",
        countDown: 0,
        category: "tools",
        guide: {
            en: '[reply to image]'
        }
    },

    onStart: async ({ api, event }) => {
        let link2;

        if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
            link2 = event.messageReply.attachments[0].url;
        } else if (event.attachments.length > 0) {
            link2 = event.attachments[0].url;
        } else {
            return api.sendMessage('No attachment detected. Please reply to an image.', event.threadID, event.messageID);
        }

        try {

    const toxiciter = "https://rest-nyx-apis.onrender.com/api";
            const res = await axios.get(`${toxiciter}/imgur?url=${encodeURIComponent(link2)}`);
            const link = res.data.data;
            return api.sendMessage(`\n\n${link}`, event.threadID, event.messageID);
        } catch (error) {
            console.error("Error uploading image to Imgur:", error);
            return api.sendMessage("An error occurred while uploading the image to Imgur.", event.threadID, event.messageID);
        }
    }
};