export const dragElement = (element) => {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  if (element !== null)
    document.getElementById(element.id + "Header").onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function between(x, min_v, max_v) {
    x = Math.min(x, max_v);
    x = Math.max(x, min_v);
    return x;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    const widthConstraint = visualViewport.width - element.offsetWidth;
    const heightConstraint = visualViewport.height - element.offsetHeight;
    // set the element's new position:
    element.style.top =
      between(element.offsetTop - pos2, 0, heightConstraint) + "px";
    element.style.left =
      between(element.offsetLeft - pos1, 0, widthConstraint) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

export const getFormattedFileSize = (size) => {
  let sufix = "";
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (size / 1024).toFixed(2) + "KB";
  }
};

export function wrapText(text) {
  let len = 36;
  if (text != null && text.length > len) {
    let temp = text.substring(0, len);
    return temp + "...";
  }
  return text;
}

export const mergeReactionDicts = (reactions, data) => {
  for (const [messageId, emoDict] of Object.entries(data)) {
    // current reaction data for the given message
    let currentReactions = reactions[messageId];
    for (const [emoId, reactionData] of Object.entries(emoDict)) {
      if (reactionData.selected === null) {
        // if the new reaction data doesn't have data
        // about current selection, reuse the old state
        let lastState =
          currentReactions !== undefined &&
          currentReactions[emoId] !== undefined &&
          currentReactions[emoId].selected === true;
        reactionData.selected = lastState;
      }
    }
    // override reactions to the given message with new data
    reactions[messageId] = emoDict;
  }
  return reactions;
};

export const scrollToBottom = (obj, force = false) => {
  let offset = obj.scrollTop;
  let scrollHeight = obj.scrollHeight;
  let clientHeight = obj.clientHeight;
  let height = scrollHeight - clientHeight;
  if (scrollHeight - offset <= 10 || force) {
    obj.scrollTop = height;
  }
};
