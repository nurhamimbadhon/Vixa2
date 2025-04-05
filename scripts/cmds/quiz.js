const axios = require("axios");

module.exports = {
    config: {
        name: "quiz",
        aliases: ["qz"],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 0,
        role: 0,
        category: "game",
        guide: "{p}quiz bn \n{p}quiz en",
    },

    onStart: async function ({ api, event, usersData, args }) {
        const catagory = ["general", "science", "person", "game", "history", "english", "july-24"];
        const type = catagory[Math.floor(Math.random() * catagory.length)];
        const input = args.join('').toLowerCase() || type;
        let timeout = 30;
        let category = input === "en" ? "english" : type;

        try {
            const hasan = "https://hasan-all-apis.onrender.com";
            const response = await axios.get(`${hasan}/quiz?category=${input}`);
            const quizData = response.data;
            const { question, correctAnswer, options } = quizData;
            const { a, b, c, d } = options;

            const namePlayerReact = await usersData.getName(event.senderID);
            const quizMsg = {
                body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟 ♡︎`,
            };

            api.sendMessage(
                quizMsg,
                event.threadID,
                (error, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        type: "reply",
                        commandName: this.config.name,
                        author: event.senderID,
                        messageID: info.messageID,
                        dataGame: quizData,
                        correctAnswer,
                        nameUser: namePlayerReact,
                        attempts: 0
                    });

                    setTimeout(() => {
                        api.unsendMessage(info.messageID);
                    }, timeout * 1000);
                },
                event.messageID
            );
        } catch (error) {
            console.error("❌ | Error occurred:", error);
            api.sendMessage(error.message, event.threadID, event.messageID);
        }
    },

    onReply: async ({ event, api, Reply, usersData }) => {
        const { correctAnswer, nameUser, author } = Reply;
        if (event.senderID !== author) {
            return api.sendMessage("❌ | This is not your quiz!", event.threadID, event.messageID);
        }

        const maxAttempts = 2;
        let userReply = event.body.toLowerCase();

        switch (Reply.type) {
            case "reply": {
                if (Reply.attempts >= maxAttempts) {
                    await api.unsendMessage(Reply.messageID);
                    return api.sendMessage(
                        `🚫 | ${nameUser}, you have reached the max attempts.\n✅ | The correct answer is: ${correctAnswer.toUpperCase()}`,
                        event.threadID,
                        event.messageID
                    );
                }


                try {
                 const chack = "https://hasan-all-apis.onrender.com";
                 const no = Reply.dataGame.id
                    const checkResponse = await axios.get(`${chack}/quiz/check?id=${no}&answer=${userReply}`);

                    if (checkResponse.data.isCorrect) {
                        api.unsendMessage(Reply.messageID).catch(console.error);
                        let rewardCoins = 400;
                        let rewardExp = 200;
                        let userData = await usersData.get(author);
                        await usersData.set(author, {
                            money: userData.money + rewardCoins,
                            exp: userData.exp + rewardExp,
                            data: userData.data,
                        });

                        api.sendMessage(
                            `🎉 | Congrats, ${nameUser}! You got it right!\n💰 Earned ${rewardCoins} Coins & ${rewardExp} EXP!`,
                            event.threadID,
                            event.messageID
                        );
                    } else {
                        Reply.attempts += 1;
                        global.GoatBot.onReply.set(Reply.messageID, Reply);
                        api.sendMessage(
                            `❌ | Wrong Answer. You have ${maxAttempts - Reply.attempts} attempts left.\n✅ | Try Again!`,
                            event.threadID,
                            event.messageID
                        );
                    }
                } catch (error) {
                    console.error("❌ | Error in checking answer:", error);
                    api.sendMessage("❌ | Error occurred while checking answer.", event.threadID, event.messageID);
                }

                break;
            }
            default:
                break;
        }
    },
};