import config from "./endpoints.json";

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function logIn(username, password) {
  console.log(config);
  return request({
    url: config.apiUrl + "/user/id/by/nickname/" + encodeURI(username),
    method: "GET",
  });
}

export function getChatRoomList(userId) {
  return request({
    url: config.apiUrl + "/chatroom/list/" + encodeURI(userId),
    method: "GET",
  });
}

export function getMessages(chatId) {
  return request({
    url: config.apiUrl + "/chatroom/" + encodeURI(chatId) + "/messages",
    method: "GET",
  });
}

export function sendMessage(userId, chatId, content) {
  return request({
    url: config.apiUrl + "/chatroom/" + encodeURI(chatId) + "/send",
    method: "POST",
    body: JSON.stringify({ content, chatId, senderId: userId }),
  });
}

export class StompApi {
  constructor(api) {
    this.api = api;
    this.promises = {};
  }

  sendPromise(url, msg, headers = {}, timeout = 5000) {
    return new Promise((resolve, reject) => {
      let id = Math.random().toString(36).substring(2);
      this.promises[id] = { resolve, reject };
      this.api.send(
        url,
        Object.assign({ r: id }, headers),
        JSON.stringify(msg)
      );
      setTimeout(() => reject(null), timeout);
    });
  }
  subscribe(path, f, headers) {
    this.api.subscribe(path, f, headers);
  }

  disconnect() {
    if (this.api != null) {
      this.api.disconnect();
    }
    this.api = null;
  }

  get connected() {
    return this.api != null && this.api.connected;
  }

  setClient(api) {
    this.api = api;
    this.promises = {};
  }

  setLastRead(chatId) {
    this.api.send(
      "/app/last-read",
      {},
      JSON.stringify({
        channelId: chatId,
      })
    );
  }

  sendChat(chatId, content) {
    this.api.send(
      "/app/send-chat",
      {},
      JSON.stringify({
        channelId: chatId,
        content: content,
      })
    );
  }

  joinDirectChat(nickname) {
    return this.sendPromise("/app/create-room/direct", nickname);
  }

  createGroupChat(groupName) {
    return this.sendPromise("/app/create-room/group", groupName);
  }

  joinChatByCode(code) {
    return this.sendPromise("/app/join-room/code", code);
  }

  handleResponse(msg) {
    let r = msg.headers["r"];
    if (this.promises[r] !== undefined) {
      console.log(`Received promise ${r}`);
      this.promises[r].resolve(JSON.parse(msg.body));
      delete this.promises[r];
    } else {
      console.log(`Failed ${r}`);
    }
  }
}
