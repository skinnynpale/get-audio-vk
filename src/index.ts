import parseAudios from "./parse-audios";

const cookie =
  "remixlang=0; remixstid=1326033251_8da2AvbCV8rZJNzAeGs50jSxR2o3J3gKENoP9tZYvZX; remixflash=0.0.0; remixscreen_depth=24; remixscreen_orient=1; remixgp=2cac5f158b8954d9041f4d4192ae0319; remixdt=14400; tmr_lvid=0253f2dfd23ee62533b6e147b28d6856; tmr_lvidTS=1582615776101; remixusid=NzI3MGUxYThjOWNjNzNjZDQyMTAwY2Iw; remixvoice=0; remixrefkey=f277b9c7e0b0127d5c; remixsid=6e0ce346a5b90ef22a8392c2cc492cadfb3e7d6b943998398d48f41457629; remixseenads=0; tmr_reqNum=120; tmr_detect=0%7C1582652386258; remixcurr_audio=-158134892_456239159";

parseAudios("377897606", cookie);
