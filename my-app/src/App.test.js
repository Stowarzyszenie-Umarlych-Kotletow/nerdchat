import { render, screen } from '@testing-library/react';
import React, { useState, useEffect } from "react";
import App from './App';
import {findEmoji} from './common/Api';
import {getFormattedFileSize, mergeReactionDicts, wrapText} from './common/utils';
import {getEmojiFromLabels} from './messageBoard/Messages/MessageItemTools';

const emojis = [{"id":1002,"label":"jamesmay","dataText":"\uD83D\uDC22"},{"id":1003,"label":"heart","dataText":"❤️"},{"id":1004,"label":"snowman","dataText":"⛄️"},{"id":1005,"label":"smiley","dataText":"\uD83D\uDE03"},{"id":1006,"label":"blush","dataText":"\uD83D\uDE0A"},{"id":1007,"label":"france_zip","dataText":"\uD83E\uDD56"},{"id":1008,"label":"rainbow","dataText":"\uD83C\uDF08"},{"id":1009,"label":"game","dataText":"\uD83C\uDFAE"},{"id":1010,"label":"police","dataText":"\uD83C\uDF69"},{"id":1011,"label":"king_dong","dataText":"\uD83E\uDD8D"},{"id":1012,"label":"beers","dataText":"\uD83C\uDF7B"},{"id":1013,"label":"fries","dataText":"\uD83C\uDF5F"},{"id":1014,"label":"pierogas","dataText":"\uD83E\uDD5F"},{"id":1015,"label":"hush","dataText":"\uD83E\uDD10"},{"id":1016,"label":"love","dataText":"\uD83D\uDE0D"},{"id":1017,"label":"lie","dataText":"\uD83E\uDD25"},{"id":1018,"label":"clown","dataText":"\uD83E\uDD21"},{"id":1019,"label":"horizontal_italian","dataText":"\uD83E\uDD0F"},{"id":1020,"label":"winner","dataText":"\uD83E\uDD47"},{"id":1021,"label":"teeth","dataText":"\uD83D\uDE01"},{"id":1022,"label":"lmao","dataText":"\uD83D\uDE02"},{"id":1023,"label":"lmao_sideways","dataText":"\uD83E\uDD23"},{"id":1024,"label":"hehe","dataText":"\uD83D\uDE04"},{"id":1025,"label":"xd","dataText":"\uD83D\uDE06"},{"id":1026,"label":"wink","dataText":"\uD83D\uDE09"},{"id":1027,"label":"tongue","dataText":"\uD83D\uDE0B"},{"id":1028,"label":"cool","dataText":"\uD83D\uDE0E"},{"id":1029,"label":"devil","dataText":"\uD83D\uDE08"},{"id":1030,"label":"kiss","dataText":"\uD83D\uDE18"},{"id":1031,"label":"small_smile","dataText":"\uD83D\uDE42"},{"id":1032,"label":"hande_hoch","dataText":"\uD83E\uDD17"},{"id":1033,"label":"smh","dataText":"\uD83E\uDD14"},{"id":1034,"label":"poker_face","dataText":"\uD83D\uDE10"},{"id":1035,"label":"no_face","dataText":"\uD83D\uDE36"},{"id":1036,"label":"eyeroll","dataText":"\uD83D\uDE44"},{"id":1037,"label":"blood","dataText":"\uD83E\uDE78"},{"id":1038,"label":"crab","dataText":"\uD83E\uDD80"},{"id":1039,"label":"juan","dataText":"\uD83D\uDC0E"},{"id":1040,"label":"virus","dataText":"\uD83E\uDDA0"},{"id":1041,"label":"bin","dataText":"\uD83D\uDDD1"}]


test('Initial test', () => {
  expect(2+2).toBe(4);
});

describe('Finding emoji', () => {
  test('Emoji exists', () => {
    let emoji = findEmoji(emojis, 1002);
    expect(emoji).toStrictEqual({"id":1002,"label":"jamesmay","dataText":"\uD83D\uDC22"});
  });
  test('Emoji does not exist', () => {
    let emoji = findEmoji(emojis, 100);
    expect(emoji).toBe(null);
  });
});

describe('Wrapping text', () => {
  test('Containing overflow', () => {
    let res = wrapText('I love testing react appsI love testing react appsI love testing react appsI love testing react apps');
    expect(res).toStrictEqual('I love testing react appsI love test...');
  });
  test('Not enough letters', () => {
    let res = wrapText('I love golden retrievers');
    expect(res).toStrictEqual('I love golden retrievers');
  });
  test('Null accidentally passed', () => {
    let res = wrapText(null);
    expect(res).toBe(null);
  });
});

describe('Formatting file size', () => {
  test('Formatting into MBs', () => {
    let fileSize = getFormattedFileSize(80550238);
    expect(fileSize).toStrictEqual('76.82MB');
  });
  test('Formatting into KBs', () => {
    let fileSize = getFormattedFileSize(32124);
    expect(fileSize).toStrictEqual('31.37KB');
  });
  test('Negative value passed', () => {
    let fileSize = getFormattedFileSize(-1337);
    expect(fileSize).toBe(null);
  });
});

describe('Getting emojis from labes', () => {
  test('Label exists', () => {
    let res = getEmojiFromLabels('I :heart: you', emojis);
    expect(res).toStrictEqual('I ❤️ you');
  });
  test('Label does not exist', () => {
    let res = getEmojiFromLabels('I :react: you', emojis);
    expect(res).toStrictEqual('I :react: you');
  });
  test('Misspelled label', () => {
    let res = getEmojiFromLabels('Thanks :smiley;', emojis);
    expect(res).toStrictEqual('Thanks :smiley;');
  });
});

describe('Merging emojis dictionaries', () => {
  test('Merge to true', () => {
    let a = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 2,
          "selected": true
        },
        "1013": {
          "emojiId": 1013,
          "count": 1,
          "selected": false
        }
      }
    }
    let b = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 3,
          "selected": null
        }
      }
    }
    let c = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 3,
          "selected": true
        }
      }
    }
    let res = mergeReactionDicts(a, b);
    expect(res).toStrictEqual(c);
  });
  test('Merge to false', () => {
    let a = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 5,
          "selected": false
        },
        "1013": {
          "emojiId": 1013,
          "count": 1,
          "selected": false
        }
      }
    }
    let b = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 7,
          "selected": null
        }
      }
    }
    let c = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 7,
          "selected": false
        }
      }
    }
    let res = mergeReactionDicts(a, b);
    expect(res).toStrictEqual(c);
  });
  test('Merge empty dict', () => {
    let a = {
    }
    let b = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 7,
          "selected": null
        }
      }
    }
    let c = {
      "1005": {
        "1009": {
          "emojiId": 1009,
          "count": 7,
          "selected": false
        }
      }
    }
    let res = mergeReactionDicts(a, b);
    expect(res).toStrictEqual(c);
  });
});
