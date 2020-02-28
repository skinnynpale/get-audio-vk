## get-audio-vk

Parse **audios** from user or public in VK

**yarn** add get-audio-vk

#### TODO

1. Support russian symbols
2. Multi-factor authentication

#### Basic Usage

```javascript
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
})();
```

**login** - email or phone

**pass** - your password

**yourId** - your VK ID

**headless** - mode when you see browser, default: true

parse.**run**( **target-id**: user-id or public-id, **max-tracks** )

parse.**exit** - close browser

#### Multithreading

```javascript
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
```