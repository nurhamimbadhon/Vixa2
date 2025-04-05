const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

module.exports = {
  config: {
    name: "ytb",
    version: "1.5",
    author: "Nyx",
    countDown: 5,
    role: 0,
    description: {
      en: "Search and download YouTube videos or audio (under 10 minutes)"
    },
    category: "MEDIA",
    guide: {
      en: "{pn} [video|-v] [<video name>]: Search and download video from YouTube\n" +
        "{pn} [audio|-a] [<video name>]: Search and download audio from YouTube\n" +
        "{pn} [info|-i] [<video name>]: Get video information from YouTube\n" +
        "{pn} [url|-u] [<video url>] [video|-v | audio|-a]: Download video or audio from URL"
    }
  },
  
  onStart: async function({ args, message, event, commandName, api }) {
    const type = args[0];
    const query = args.slice(1).join(" ");
    
    if (!type || !query) {
      return message.reply("Please specify the type and query.");
    }
    
    if (type === "-u" || type === "url") {
      const url = args[1];
      const action = args[2];
      
      if (!url || !action) {
        return message.reply("Please provide a valid URL and action.");
      }
      
      if (action === "-v" || action === "video") {
        await downloadVideo(url, message);
      } else if (action === "-a" || action === "audio") {
        const videoId = extractVideoId(url);
        await downloadYouTubeAudio(videoId, message);
      } else {
        return message.reply("Invalid action. Use -v for video or -a for audio.");
      }
    }
    else if (type === "-v" || type === "video" || type === "-a" || type === "audio" || type === "-i" || type === "info") {
      const loadingMessage = await message.reply(`${spinner[0]} Searching...`);
      let currentFrame = 0;
      const intervalId = setInterval(async () => {
        currentFrame = (currentFrame + 1) % spinner.length;
        await api.editMessage(`${spinner[currentFrame]} Searching...`, loadingMessage.messageID);
      }, 200);
      
      try {
        const searchResults = await searchYouTube(query);
        
        clearInterval(intervalId);
        await api.unsendMessage(loadingMessage.messageID);
        
        if (searchResults.length === 0) {
          return message.reply("⛔ No results found.");
        }
        
        if (type === "-i" || type === "info") {
          const firstVideo = searchResults[0];
          const videoInfo = await getVideoInfo(firstVideo.id);
          return message.reply({
            body: `Title: ${videoInfo.title}\nDuration: ${videoInfo.duration}\nViews: ${videoInfo.views}\nUpload Date: ${videoInfo.uploadDate}\nURL: ${firstVideo.url}`,
            attachment: await getStreamFromURL(videoInfo.thumbnail)
          });
        }
        
        const limitedResults = searchResults.slice(0, 5);
        
        const messageBody = limitedResults.map((result, index) =>
          `${index + 1}. ${result.title}\n`
        ).join("\n");
        
        const listMessage = await message.reply({
          body: `🎬 Please choose a track:\n\n${messageBody}`,
          attachment: await Promise.all(limitedResults.map(result => getStreamFromURL(result.thumbnail)))
        });
        
        global.GoatBot.onReply.set(listMessage.messageID, {
          commandName,
          messageID: listMessage.messageID,
          author: event.senderID,
          searchResults: limitedResults,
          type
        });
        
      } catch (error) {
        clearInterval(intervalId);
        await api.unsendMessage(loadingMessage.messageID);
        await message.reply(`❌ Error occurred during search: ${error.message}`);
      }
    }
  },
  
  onReply: async ({ event, api, Reply, message }) => {
    const { searchResults, type } = Reply;
    const choice = parseInt(event.body);
    
    if (!isNaN(choice) && choice >= 1 && choice <= searchResults.length) {
      const selectedTrack = searchResults[choice - 1];
      await api.unsendMessage(Reply.messageID);
      const loadingMessage = await message.reply(`${spinner[0]} Downloading...`);
      let currentFrame = 0;
      const intervalId = setInterval(async () => {
        currentFrame = (currentFrame + 1) % spinner.length;
        await api.editMessage(`${spinner[currentFrame]} Downloading...`, loadingMessage.messageID);
      }, 200);
      
      try {
        if (type === "-v" || type === "video") {
          await downloadVideo(selectedTrack.url, message);
        } else if (type === "-a" || type === "audio") {
          const videoId = extractVideoId(selectedTrack.url);
          await downloadYouTubeAudio(videoId, message);
        }
        
        clearInterval(intervalId);
        await api.unsendMessage(loadingMessage.messageID);
        await api.unsendMessage(Reply.messageID);
      } catch (error) {
        clearInterval(intervalId);
        await api.unsendMessage(loadingMessage.messageID);
        await message.reply(`❌ Download failed: ${error.message}`);
      }
    } else {
      await message.reply("❌ Invalid selection. Please choose a valid number.");
    }
  }
};

async function searchYouTube(query) {
  const searchResults = await yts(query);
  return searchResults.videos
    .filter(video => {
      const duration = video.duration.seconds;
      return duration <= 600;
    })
    .map(video => ({
      id: video.videoId,
      title: video.title,
      duration: video.duration.timestamp,
      thumbnail: video.thumbnail,
      url: `https://www.youtube.com/watch?v=${video.videoId}`
    }));
}

async function downloadVideo(url, message) {
  const response = await axios.get(`https://fastapi-nyx-production.up.railway.app/y?url=${encodeURIComponent(url)}&type=mp4`);
  const videoUrl = response.data.url;
  const tempFilePath = path.join(__dirname, 'nyx_video.mp4');
  const writer = fs.createWriteStream(tempFilePath);
  const videoResponse = await axios({ url: videoUrl, responseType: 'stream' });
  videoResponse.data.pipe(writer);
  
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  
  await message.reply({
    body: response.data.title,
    attachment: fs.createReadStream(tempFilePath)
  });
  
  fs.unlink(tempFilePath, (err) => {
    if (err) console.error(err);
  });
}

async function downloadYouTubeAudio(videoId, message) {
  const response = await axios.get(`https://fastapi-nyx-production.up.railway.app/y?url=https://www.youtube.com/watch?v=${videoId}&type=mp3`);
  const audioUrl = response.data.url;
  const tempFilePath = path.join(__dirname, 'nyx_audio.mp3');
  const writer = fs.createWriteStream(tempFilePath);
  const audioResponse = await axios({ url: audioUrl, responseType: 'stream' });
  audioResponse.data.pipe(writer);
  
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  
  await message.reply({
    body: "Audio downloaded",
    attachment: fs.createReadStream(tempFilePath)
  });
  fs.unlink(tempFilePath, (err) => {
    if (err) console.error(err);
  });
}

async function getVideoInfo(videoId) {
  const video = await yts({ videoId });
  return {
    title: video.title,
    duration: video.duration.timestamp,
    views: video.views,
    uploadDate: video.uploadDate,
    thumbnail: video.thumbnail
  };
}

async function getStreamFromURL(url) {
  const response = await axios({ url, responseType: 'stream' });
  return response.data;
}

function extractVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url.split("/").pop();
}