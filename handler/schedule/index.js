require("dotenv").config();
const { loadData, updateData } = require("../../util.js");
const schedule = require("node-schedule");
const owner = "628986657752@c.us";
const { exec } = require("child_process");

async function collect() {
  exec("node collector.js", (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err);
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  });
}

async function sendStory(client) {
  const metadataStory = await loadData("./metadata-story.json");
  await client.sendText(owner, "Update story");

  metadataStory.map(story => {
    if (story.send_whatsapp) return;
    if (story.mediaType == 1) {
      // Image
      client
        .sendFileFromUrl(owner, story.url, "1.jpg", "")
        .then(data => {
          console.log(`Success send ${story.id}`);
          updateData("./metadata-story.json", story.id, true, "whatsapp");
        })
        .catch(error => {
          console.log(`failed to send ${story.id}`);
        });
    } else if (story.mediaType == 2) {
      // Videos
      client
        .sendFileFromUrl(owner, story.url, "1.mp4", "")
        .then(data => {
          console.log(`Success send ${story.id}`);
          updateData("./metadata-story.json", story.id, true, "whatsapp");
        })
        .catch(error => {
          console.log(`failed to send ${story.id}`);
        });
    }
  });
}
// twice a day
// 00 01,13 * * *
module.exports = scheduleHandler = async client => {
  var collect1 = schedule.scheduleJob("*/3 * * * *", async function () {
    collect();
  });
  var sendWhatsapp = schedule.scheduleJob("*/2 * * * *", async function () {
    sendStory(client);
  });
};
