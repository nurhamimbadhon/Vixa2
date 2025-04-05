const axios = require('axios');


module.exports = {
    config: {
        name: "prompt",
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        category: "tools",
        description: "Convert an image to text prompt.",
        usages: "{pn} [reply to an image]"
    },

    onStart: async function ({ api, event, args }) {
        const h = event.messageReply?.attachments?.[0]?.url || args.join(' ');
        if (!h) {
            return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);
        }

        try {
            const toxiciter = "https://rest-nyx-apis.onrender.com/api";
            const response = await axios.get(`${toxiciter}/prompt?url=${encodeURIComponent(h)}`);
            
            if (!response.data) {
                return api.sendMessage("❌ Failed to generate prompt from image.", event.threadID, event.messageID);
            }

            api.sendMessage(response.data, event.threadID, event.messageID);
        } catch (error) {
            console.error("❌ Error:", error.message);
            api.sendMessage("❌ An error occurred while processing the image.", event.threadID, event.messageID);
        }
    }
};