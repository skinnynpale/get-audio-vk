const async = require("async");
const { ParseAudios } = require("./dist/index");
require("dotenv").config();

// basic
(async () => {
  const login = process.env.LOGIN;
  const pass = process.env.PASS;
  const yourId = process.env.YOUR_ID;

  const parse = new ParseAudios({ login, pass, yourId, headless: false });
  await parse.launch();
  const tracks = await parse.run(-158134892, 5);
  await parse.exit();
  console.log(tracks);
})();

// multithreading
(async () => {
  const login = process.env.LOGIN;
  const pass = process.env.PASS;
  const yourId = process.env.YOUR_ID;

  const parse = new ParseAudios({ login, pass, yourId, headless: false });
  await parse.launch();

  const queueArray = async.queue(async task => {
    await task();
  }, 10);

  queueArray.drain(async () => {
    await parse.exit();
  });

  queueArray.push(() => parse.run(19463413, 5));
  queueArray.push(() => parse.run(377897606, 5));

  setTimeout(() => {
    queueArray.push(() => parse.run(-165626408, 5));
  }, 10000);
})();
