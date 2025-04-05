module.exports = {

  config: {

    name: "top",

    version: "1.1",

    author: "Shikaki",

    category: "economy",

    shortDescription: {

      vi: "Xem 10 người giàu nhất",

      en: "View the top 10 richest people",

    },

    longDescription: {

      vi: "Xem danh sách 10 người giàu nhất trong nhóm",

      en: "View the list of the top 10 richest people in the group",

    },

    guide: {

      en: "{pn} 1\n{pn} 50\n{pn} 100",

    },

    role: 0,

  },



  onStart: async function ({ message, usersData, args, api }) {

    // Get all users' data

    const allUserData = await usersData.getAll();



    // Filter out users with invalid money values and sort by money in descending order

    const sortedUsers = allUserData

      .filter((user) => !isNaN(user.money))

      .sort((a, b) => b.money - a.money);



    let msg = "♔︎ 𝐓𝐎𝐏 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐏𝐄𝐑𝐒𝐎𝐍 ♔︎\n \n";



    if (args[0] === "top") {

      // Display the richest person

      if (sortedUsers.length > 0) {

        const richestUser = sortedUsers[0];

        const formattedBalance = formatNumberWithFullForm(richestUser.money);

        msg += `1. ♕︎${richestUser.name}♕︎ \n        ➥ $ ${formattedBalance}\n`;

      } else {

        msg += "No users found.\n";

      }

    } else {

      // Default: Display the top 10 richest people

      const topCount = Math.min(parseInt(args[0]) || 10, sortedUsers.length);

      sortedUsers.slice(0, topCount).forEach((user, index) => {

        const formattedBalance = formatNumberWithFullForm(user.money);

        msg += `${index + 1}. ♕︎${user.name}♕︎ \n        ➥$ ${formattedBalance}\n`;

      });

    }



    msg += "💫𝐁𝐞𝐬𝐭 𝐨𝐟 𝐥𝐮𝐜𝐤💫";



    message.reply(msg);

  },

};



// Function to format a number with full forms (e.g., 1 Thousand, 133 Million, 76.2 Billion)

function formatNumberWithFullForm(number) {

  const fullForms = [

    "",

    "K",

    "M",

    "Billion",

    "Trillion",

    "Quadrillion",

    "Quintillion",

    "Hextillion",

    "Heptillion",

    "Octillion",

    "Nonillion",

    "Decillion",

  ];



  // Calculate the full form of the number (e.g., Thousand, Million, Billion)

  let fullFormIndex = 0;

  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {

    number /= 1000;

    fullFormIndex++;

  }



  // Format the number with two digits after the decimal point

  const formattedNumber = number.toFixed(2);



  // Add the full form to the formatted number

  return `${formattedNumber} ${fullForms[fullFormIndex]}`;

}
