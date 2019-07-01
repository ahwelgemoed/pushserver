const testFolder = './videos';
const fs = require('fs');

readFilders = async () => {
  let video = [];
  await fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
      video.push({ file });
    });
  });
  return video;
};
appRouter = async app => {
  await app.get('/', function(req, res) {
    let vid = readFilders();
    console.log(vid);

    res.status(200).send(vid);
  });
};

module.exports = appRouter;
