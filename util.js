const fs = require("fs");
const fsp = require("fs-path");
const download = require("image-downloader");
const fetch = require("node-fetch");

const upsertDirectory = path => {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, { recursive: true }, err => {
      if (err) throw err;
    });
  }
};

const downloadImage = async (url, dir, filename) => {
  const opt = {
    url,
    dest: `${dir}/${filename}`,
    extractFilename: false,
  };
  download
    .image(opt)
    .then(({ filename }) => {
      return true;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
};
const downloadVideo = async (url, dir, filename) => {
  const opt = {
    url,
    dest: `${dir}/${filename}`,
  };
  const response = await fetch(opt.url);
  const buffer = await response.buffer();

  fs.writeFile(opt.dest, buffer, () => true);
};
const storeData = (path, data) => {
  try {
    fsp.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};
const loadData = path => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return false;
  }
};
const updateData = function (path, id, value, mediaName) {
  const data = fs.readFileSync(path, "utf8");
  const content = JSON.parse(data);
  if (mediaName == "discord") {
    content.forEach(s => s.id === id && (s.send_discord = value));
  } else if (mediaName == "telegram") {
    content.forEach(s => s.id === id && (s.send_telegram = value));
  } else if (mediaName == "whatsapp") {
    content.forEach(s => s.id === id && (s.send_whatsapp = value));
  }

  fsp.writeFileSync(path, JSON.stringify(content));
};

const options = function (headless, start) {
  const option = {
    sessionId: "session",
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--aggressive-cache-discard",
      "--disable-cache",
      "--disable-application-cache",
      "--disable-offline-load-stale-cache",
      "--disk-cache-size=0",
    ],
  };

  return option;
};

module.exports = {
  storeData,
  loadData,
  updateData,
  downloadImage,
  downloadVideo,
  upsertDirectory,
  options,
};
