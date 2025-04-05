const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "monitor",
    aliases: ["run"],
    version: "1.0",
    author: "Vex_kshitiz",
    role: 0,
    shortDescription: { en: "Displays the bot's uptime and ping." },
    longDescription: { en: "Find out how long the bot has been tirelessly serving you and its current ping." },
    category: "system",
    guide: { en: "Use {p}monitor to reveal the bot's uptime and ping." }
  },
  onStart: async function ({ api, event, args }) {
    try {
      const t = Date.now(); 

      const s = ["zoro", "madara", "obito", "luffy"];

      const r = Math.floor(Math.random() * s.length);
      const q = s[r];

     
      const hasan = global.GoatBot.config.api.apis;
      const u = `${hasan}/pinterest?search=${encodeURIComponent(q)}`;

      const a = await axios.get(u);
      const l = a.data.data;

      const i = Math.floor(Math.random() * l.length);
      const p = l[i];

      const b = await axios.get(p, { responseType: 'arraybuffer' });
      const f = path.join(__dirname, 'cache', `monitor_image.jpg`);
      await fs.outputFile(f, b.data);

      const e = process.uptime();
      const k = Math.floor(e % 60);
      const h = Math.floor((e / 60) % 60);
      const g = Math.floor((e / (60 * 60)) % 24);
      const d = Math.floor(e / (60 * 60 * 24));

      let c = `${d} 𝑑𝑎𝑦𝑠, ${g} ℎ𝑜𝑢𝑟𝑠, ${h} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠, and ${k} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`;
      if (d === 0) {
        c = `${g} ℎ𝑜𝑢𝑟𝑠, ${h} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠, and ${k} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`;
        if (g === 0) {
          c = `${h} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠, and ${k} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`;
          if (h === 0) {
            c = `${k} seconds`;
          }
        }
      }

      const m = Date.now() - t;

      const message = `~𝐻𝐸𝐿𝐿𝑂...!?\n 𝑇ℎ𝑒 𝐵𝑜𝑡 𝐻𝑎𝑠 𝐵𝑒𝑒𝑛 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝑓𝑜𝑟:\n${c}\n\n𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑝𝑖𝑛𝑔: ${m} \n\n❁ 𝗢𝗪𝗡𝗘𝗥 ❁:☠︎︎ 𝐻𝐴𝑆𝐴𝑁 ☠︎︎`;
      const imageStream = fs.createReadStream(f);

      await api.sendMessage({
        body: message,
        attachment: imageStream
      }, event.threadID, event.messageID);

      await fs.unlink(f);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred.`, event.threadID, event.messageID);
    }
  }
};
