module.exports = {
  config: {
    name: "animagine",
    aliases: ["anigen"],
    version: "1.0",
    author: "Anas & ♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "image",
    guide: {
      vi: "",
      en:
        "Type {pn} with your prompts",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;
      

      
      const waitingMessage = await message.reply("⏰ | Creating your Animagination...");

      
      const h = "https://hasan-all-apis.onrender.com";
      
      const API = `${h}/anigen?prompt=${encodeURIComponent(prompt)}`;

      
      const imageStream = await global.utils.getStreamFromURL(API);

      
      await message.reply({
        attachment: imageStream,
      });

      
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.log(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
