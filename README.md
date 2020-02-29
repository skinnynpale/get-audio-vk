# get-audio-vk

Parse open **audios** from user or public in VK

# Installation

```
yarn add get-audio-vk
or
npm install get-audio-vk --save
```

# Examples

### Basic usage

```javascript
const { ParseAudios } = require("get-audio-vk");

// basic
(async () => {
  const login = "+79996665544"; // phone or email
  const pass = "MYPASSWORD";
  const yourId = 133456123; // your VK ID

  const parse = new ParseAudios({ login, pass, yourId, headless: false }); // headless: false if u wanna watch process
  await parse.launch();
  const tracks = await parse.run(-158134892, 5); // 1. target-id, 2. max-tracks
  await parse.exit();
  console.log(tracks);

  // tracks:

  // {
  //   mp3: 'https://psv4.vkuseraudio.net/c815431/u124801980/audios/8853f46d20b7.mp3?extra=Cybh6ofKlM__o39_Lc1ffkU_7oAtAjgFiSbeWJZrtsGu8gUlSgakwor761HJEJFWnCbiev0o3wZVyeTMtTrmidWQuTUnhysO2XbLLDBS8Jf19fcF398focoR18Jx1qFuaHaHvpcGSzGb2T3A-vfy4Qmwkck',
  //   author: 'PRODUCERSGANG',
  //   title: 'I DID IT AGAIN',
  //   cover: 'https://sun9-20.userapi.com/c847017/v847017051/169a1c/MIJ3kZ5idt8.jpg'
  // }

  // ...
  // {
  //    ...
  // }
})().catch(err => {
  console.log("❌ " + err.message);
  process.exit(1);
});
```

#### Options

- `await parse.launch()` - start browser
- `await parse.run(target-id, max-tracks)` - run parser
- `await parse.exit()` - close browser

### Multithreading

```javascript
const { ParseAudios } = require("get-audio-vk");
const async = require("async");

(async () => {
  const login = "+79996665544"; // phone or email
  const pass = "MYPASSWORD";
  const yourId = 133456123; // your VK ID

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
})().catch(err => {
  console.log("❌ " + err.message);
  process.exit(1);
});
```
