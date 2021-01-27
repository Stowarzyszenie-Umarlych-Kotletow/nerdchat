import "./MessageItemTools.css";

function formatUrls(data) {
  if(data == null)
    return [];
  let slices = data.split(" ");
  let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  let regex = new RegExp(urlRegex);
  let results = [];
  let p = "";
  for (let i = 0; i < slices.length; i++) {
    if (slices[i].match(regex)) {
      results.push(<span>{p} </span>);
      p = (
        <a href={slices[i]} target="_blank" rel="noreferrer">
          {slices[i]}
        </a>
      );
      results.push(p);
      p = "";
    } else {
      p = p + " " + slices[i];
    }
  }
  if (p.length !== 0) {
    results.push(<span>{p}</span>);
  }
  return results;
}

function getEmojiFromLabels(data, emojis) {
  if(data === null)
    return;
  let slices = data.split(" ");
  let newData = [];
  let r = /:([a-z_\.]+):/gi;

  let findEmoji = (text) => {
    if (emojis.length !== undefined) {
      for (let emoji of emojis) {
        if (emoji.label === text) {
          return emoji.dataText;
        }
      }
    }
    return null;
  };
  for (let i = 0; i < slices.length; i++) {
    let str = slices[i];
    str = str.replace(r, (match, p1, offset, str) => {
      let emoji = findEmoji(p1);
      return emoji !== null ? emoji : match;
    });
    newData.push(str);
  }
  return newData.join(" ");
}

export { formatUrls, getEmojiFromLabels };
