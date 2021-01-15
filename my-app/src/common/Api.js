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
      if (json.data !== undefined) {
        return json.data;
      }
      return json;
    })
  );
};

export function sendMessage(userId, chatId, content) {
  return request({
    url: config.apiUrl + "/chatroom/" + encodeURI(chatId) + "/send",
    method: "POST",
    body: JSON.stringify({ content, chatId, senderId: userId }),
  });
}

export class HttpApi {
  constructor(creds, setCreds) {
    this.stomp = new StompApi(this);
    this.credentials = creds;
    this.setCredentials = setCreds;
    this.credsHandler = null;
  }

  get token() {
    return this.credentials.token;
  }

  request(options) {
    console.log(
      `my token is ${this.token} oh wait its ${JSON.stringify(
        this.credentials
      )}`
    );
    if (this.token !== null) {
      options.headers = { "X-Token": this.token };
    }
    return request(options);
  }

  requestGet(url) {
    return this.request({ url: config.apiUrl + url, method: "GET" });
  }
  requestPost(url, body) {
    console.log("HEY!" + config.apiUrl);
    return this.request({
      url: config.apiUrl + url,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  createToken(nickname, password) {
    return this.requestPost("/auth/create_token", {
      nickname,
      password,
    }).then((m) => {
      this.credentials = m;
      this.setCredentials(m);
    });
  }

  getChatRoomList() {
    return this.requestGet("/user/chatrooms/list");
  }

  getChatRoomMessages(chatId) {
    return this.requestGet(`/chatroom/${encodeURI(chatId)}/messages`);
  }
  createAccount(nickname, firstName, lastName, password) {
    return this.requestPost("/auth/register_account", {
      nickname,
      firstName,
      lastName,
      password,
    });
  }
}

export class StompApi {
  constructor(http) {
    this.api = null;
    this.promises = {};
    this.http = http;
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

  setChatroomCode(chatRoomId, joinCode) {
    return this.sendPromise("/app/manage-room/code", { chatRoomId, joinCode });
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
