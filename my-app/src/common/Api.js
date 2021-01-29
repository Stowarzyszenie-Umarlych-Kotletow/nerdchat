import config from "./endpoints.json";
import axios from "axios";

export function getAttachmentUrl(messageId, attachmentId) {
  return `${config.apiUrl}/global/message/${messageId}/attachment/${attachmentId}/download`;
}

export function findEmoji(emojis, emojiId) {
  if (emojis != null) {
    for (let e of emojis) {
      if (e.id === emojiId) {
        return e;
      }
    }
  }
  return null;
}

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }
  if (options.headers) {
    Object.keys(options.headers).forEach((v, i) => {
      headers.append(v, options.headers[v]);
    });
    delete options["headers"];
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

  _getHeaders() {
    if (this.token !== null) {
      return { "X-Token": this.token };
    }
    return {};
  }

  request(options) {
    options.headers = this._getHeaders();
    return request(options);
  }
  updateCredentials(creds) {
    this.credentials = creds;
    this.setCredentials(creds);
  }
  requestGet(url) {
    return this.request({ url: config.apiUrl + url, method: "GET" });
  }
  requestPost(url, body) {
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
      this.updateCredentials(m);
    });
  }
  refreshToken(nickname, token) {
    return this.requestPost("/auth/refresh_token", {
      nickname,
      token,
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
  getChatConfig() {
    return this.requestGet("/user/chat_config");
  }
  postChatConfig(cfg) {
    return this.requestPost("/user/chat_config", cfg);
  }

  logout() {
    this.setCredentials({ nickname: null, token: null });
  }
  getEmojiTable() {
    return this.requestGet("/global/emojis");
  }

  _uploadFile(url, file, progress) {
    let data = new FormData();
    data.append("file", file);
    return axios
      .request({
        method: "post",
        url: config.apiUrl + url,
        data,
        onUploadProgress: progress,
        headers: Object.assign(
          { "content-type": "multipart/form-data" },
          this._getHeaders()
        ),
      })
      .then((data) => data.data);
  }

  uploadFile(file, progress) {
    return this._uploadFile("/user/files/upload", file, progress);
  }

  getMyFiles() {
    return this.requestGet("/user/files");
  }
  getReactions(chatId) {
    return this.requestGet(`/chatroom/${encodeURI(chatId)}/reactions`);
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

  sendChat(chatId, content, fileId = null) {
    this.api.send(
      "/app/send-chat",
      {},
      JSON.stringify({
        channelId: chatId,
        content: content,
        fileId,
      })
    );
  }

  reactToMessage(roomId, messageId, emojiId, state) {
    return this.sendPromise("/app/react-message", {
      roomId,
      messageId,
      emojiId,
      state,
    });
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
