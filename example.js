const async = require("async");
const { ParseAudios } = require("./dist/index");
require("dotenv").config();
const fs = require("fs");

// basic
(async () => {
  const login = process.env.LOGIN;
  const pass = process.env.PASS;
  const yourId = process.env.YOUR_ID;

  const parse = new ParseAudios({
    login,
    pass,
    yourId,
    headless: false,
  });
  await parse.launch();
  const tracks = await parse.run(41697780, 5);
  await parse.exit();
  fs.writeFile("tracks.json", JSON.stringify(tracks), (err) => {
    if (err) throw err;
    console.log("The file tracks.json has been created!");
  });
})().catch((err) => {
  console.log("❌ " + err.message);
  process.exit(1);
});

// multithreading
// (async () => {
//   const login = process.env.LOGIN;
//   const pass = process.env.PASS;
//   const yourId = process.env.YOUR_ID;
//
//   const parse = new ParseAudios({ login, pass, yourId, headless: false });
//   await parse.launch();
//
//   const queueArray = async.queue(async task => {
//     await task();
//   }, 10);
//
//   queueArray.drain(async () => {
//     await parse.exit();
//   });
//
//   queueArray.push(() => parse.run(19463413, 5));
//   queueArray.push(() => parse.run(377897606, 5));
//
//   setTimeout(() => {
//     queueArray.push(() => parse.run(-165626408, 5));
//   }, 10000);
// })();
