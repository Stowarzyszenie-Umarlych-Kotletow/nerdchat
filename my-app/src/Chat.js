import "./Chat.css";
import React, { Component } from "react";
import ConversationBox from "./latestMessages/ConversationBox";
import { MessageBoard } from "./messageBoard/MessageBoard";
import config from "./common/endpoints.json";
import { Stomp } from "@stomp/stompjs";
import soundFile from "./common/notif_2.wav";
import { UserConfig, ChatContext } from "./context";

export class Chat extends Component {
  state = {
    activeChatId: null,
    chatRoomList: [],
    subscribed: {},
    emojis: [],
  };

  constructor(props) {
    super(props);
    this.board = React.createRef();
  }

  static contextType = UserConfig;

  setActiveChatId = (val) => {
    this.setState({ activeChatId: val });
  };
  setChatRoomList = (val) => {
    this.setState({
      chatRoomList: val.sort(
        (a, b) =>
          Date.parse(b.lastMessage.sentAt) - Date.parse(a.lastMessage.sentAt)
      ),
    });
  };
  setSubscribed = (val) => {
    this.setState({ subscribed: val });
  };

  connect = (creds) => {
    let stomp = this.stomp;
    stomp.disconnect();
    let stompClient = Stomp.over(() => new WebSocket(config.wsUrl));
    stomp.setClient(stompClient);
    stompClient.connect(
      { "X-token": creds.token },
      this.onConnected,
      this.onError
    );
  };
  shouldBeSubscribed = (channel) => {
    return true;
  };

  get stomp() {
    return this.props.api.stomp;
  }

  get http() {
    return this.props.api;
  }

  subscribeObj = (channelId) => {
    let obj = this.state.subscribed[channelId];
    if (obj !== undefined && obj.active) return obj;
    obj = {
      sub: this.stomp.subscribe(
        `/topic/channel/notify/${channelId}`,
        this.onMessageReceived,
        {
          id: channelId,
        }
      ),
      active: true,
    };
    return obj;
  };

  updateSubscriptions = () => {
    let newSubs = {};
    let unread = 0;
    this.state.chatRoomList.forEach((c) => {
      unread += c.unreadCount;
      if (this.shouldBeSubscribed(c)) {
        newSubs[c.chatRoomId] = this.subscribeObj(c.chatRoomId);
      } else {
        let obj = newSubs[c.chatRoomId];
        if (obj !== undefined && obj !== null && obj.active) {
          obj.sub.unsubscribe();
          obj.active = false;
        }
      }
    }, this);
    if (unread > 0) {
      document.title = "(" + unread + ") NerdChat";
    } else {
      document.title = "NerdChat";
    }

    this.setSubscribed(newSubs);
  };

  updateChatRoom(chatId, callback) {
    let newObj = [];
    for (let c of this.state.chatRoomList) {
      if (c.chatRoomId === chatId) {
        newObj.push(Object.assign({}, c, callback(c)));
      } else {
        newObj.push(c);
      }
    }
    this.setChatRoomList(newObj);
  }

  updateRoomListFromMsg = (room, msg) => {
    let activeChatId = this.state.activeChatId;
    this.updateChatRoom(room, (chat) => {
      let count = chat.unreadCount;
      if (activeChatId !== chat.chatRoomId) {
        count++;
      }
      return { lastMessage: msg, unreadCount: count };
    });
  };

  setLastRead = (chatId) => {
    this.stomp.setLastRead(chatId);
  };

  onLastRead = (msg) => {
    let m = JSON.parse(msg.body);
    this.updateChatRoom(m.chatRoomId, () => {
      return { unreadCount: 0 };
    });
  };

  onNotifyUpdated = (msg) => {
    let type = msg.headers["type"];
    if (type === "new-room") {
      this.http.getChatRoomList().then((rooms) => this.setChatRoomList(rooms));
    }
  };

  onConnected = () => {
    this.stomp.subscribe(
      `/user/${this.props.myNick}/queue/last-read`,
      this.onLastRead,
      {}
    );
    this.stomp.subscribe(
      `/user/${this.props.myNick}/queue/r`,
      (msg) => this.stomp.handleResponse(msg),
      {}
    );
    this.stomp.subscribe(
      `/user/${this.props.myNick}/queue/notify-updated`,
      this.onNotifyUpdated,
      {}
    );
    this.http.getChatRoomList().then((rooms) => this.setChatRoomList(rooms));
  };
  onError = (err) => {
    console.log(err);
  };

  onMessageReceived = (payload) => {
    let msg = JSON.parse(payload.body);
    let type = payload.headers["type"];
    let roomId = payload.headers["room"];

    if (type === "message") {
      if (this.state.activeChatId === roomId) {
        this.board.current.handleNewMessage(msg);
        this.setLastRead(this.state.activeChatId);
      }
      this.updateRoomListFromMsg(roomId, msg);
      const config = this.context;
      if (config.currentStatus === "online") {
        if (document.visibilityState !== "visible") {
          let audio = new Audio(soundFile);
          audio.play();
        }
      }
    } else if (type === "joincode") {
      this.updateChatRoom(roomId, (chat) => {
        return { joinCode: msg.code };
      });
    } else if (type === "message-reactions") {
      this.board.current.mergeReactions(msg);
    }
  };

  updateConfig = (cfg) => {
    this.props.setConfig(cfg);
    this.http.postChatConfig(cfg);
  };

  onSessionReady = () => {
    this.http.getChatConfig().then((cfg) => {
      var newCfg = this.props.config;
      Object.keys(cfg).forEach((v, i) => {
        if (cfg[v] !== null) {
          newCfg[v] = cfg[v];
        }
      }, this);
      this.props.setConfig(newCfg);
    });
  };

  updateEmojis = () => {
    this.http.getEmojiTable().then(
      (data) => {
        this.setState({ emojis: data });
      },
      (err) => {
        setTimeout(this.updateEmojis, 5000);
      }
    );
  };

  componentDidMount = () => {
    this.updateEmojis();
  };

  componentDidUpdate = (pp, ps) => {
    if (ps.chatRoomList !== this.state.chatRoomList) {
      if (this.stomp != null && this.stomp.connected)
        this.updateSubscriptions();
    }
    if (pp.creds !== this.props.creds && pp.creds.token !== this.props.creds) {
      if (this.props.creds.token != null) {
        this.onSessionReady();
        this.connect(this.props.creds);
      }
    }
    if (this.props.creds.token === null) {
      this.stomp.disconnect();
    }
  };

  render = () => {
    return (
      <ChatContext.Provider
        value={{
          myNick: this.props.myNick,
          activeChatId: this.state.activeChatId,
          setActiveChatId: this.setActiveChatId,
          chatRoomList: this.state.chatRoomList,
          setChatRoomList: this.setChatRoomList,
          sendChat: this.sendChat,
          emojis: this.state.emojis,
        }}
      >
        <div id="MainContent">
          <div id="messagesContent">
            <MessageBoard
              ref={this.board}
              {...{
                activeChatId: this.state.activeChatId,
                myNick: this.props.creds.nickname,
                api: this.http,
                roomList: this.state.chatRoomList,
                emojis: this.state.emojis,
              }}
            />
          </div>
          <ConversationBox
            updateConfig={this.updateConfig}
            setLastRead={this.setLastRead}
          />
        </div>
      </ChatContext.Provider>
    );
  };
}

export default Chat;
