module.exports = {
 config: {
	 name: "zzzzzzz",
	 version: "1.0",
	 author: "Hasan",//remodified by cliff
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "toxiciter") {
 return message.reply({
 body: `
       𝐻𝑒𝑦 𝑀𝑦 𝑛𝑎𝑚𝑒 𝑖𝑠 𝑇𝑜𝑥𝑖𝑐𝑖𝑡𝑒𝑟 ❄️
       𝐻𝑜𝑤 𝑐𝑎𝑛 𝑖 𝑎𝑠𝑠𝑖𝑠𝑡 𝑦𝑜𝑢 ?
       𝑂𝑊𝑁𝐸𝑅 : https://www.facebook.com/Itz.HaSaN.00`
        });
      }
   }
}
