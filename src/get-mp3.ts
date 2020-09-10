function getMp3(url: string) {
  const splitted = url.split("/");

  if (splitted[2].includes("cs")) {
    splitted.splice(4, 1);

    splitted[5] = splitted[5].replace(
      splitted[5].slice(0, splitted[5].indexOf(".m3u8")),
      splitted[4]
    );
    splitted[5] = splitted[5].replace(".m3u8", ".mp3");

    splitted.splice(4, 1);

    return splitted.join("/");
  }

  if (splitted[2].includes("ps")) {
    splitted.splice(5, 1);

    splitted[7] = splitted[7].replace(
      splitted[7].slice(0, splitted[7].indexOf(".m3u8")),
      splitted[6]
    );
    splitted[7] = splitted[7].replace(".m3u8", ".mp3");

    splitted.splice(6, 1);

    return splitted.join("/");
  }
}

export default getMp3;
