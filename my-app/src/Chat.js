import "./Chat.css";
import React, { Component, useContext } from "react";
import ConversationBox from "./latestMessages/ConversationBox";
import { MessageBoard } from "./messageBoard/MessageBoard";
import { getChatRoomList, StompApi } from "./common/Api";
import config from "./common/endpoints.json";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import soundFile from "./common/notif_2.wav";
import { UserConfig, ChatContext } from "./context";
import { configSetDefault } from "./common/config";

var stompClient = null;
var api = new StompApi(null);

export class Chat extends Component {
  state = {
    activeChatId: null,
    chatRoomList: [],
    subscribed: {},
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

  connect = (token) => {
    api.disconnect();
    stompClient = Stomp.over(() => new WebSocket(config.wsUrl));
    api.setClient(stompClient);
    stompClient.connect({ "X-token": token }, this.onConnected, this.onError);
  };
  shouldBeSubscribed = (channel) => {
    return true;
  };

  subscribeObj = (channelId) => {
    let obj = this.state.subscribed[channelId];
    if (obj != undefined && obj.active) return obj;
    obj = {
      sub: api.subscribe(
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
      console.log(c);
      unread += c.unreadCount;
      if (this.shouldBeSubscribed(c)) {
        newSubs[c.chatRoomId] = this.subscribeObj(c.chatRoomId);
      } else {
        let obj = newSubs[c.chatRoomId];
        if (obj != undefined && obj != null && obj.active) {
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

  updateRoomListFromMsg = (msg) => {
    let activeChatId = this.state.activeChatId;
    this.updateChatRoom(msg.chatRoomId, (chat) => {
      let count = chat.unreadCount;
      if (activeChatId !== chat.chatRoomId) {
        count++;
      }
      return { lastMessage: msg, unreadCount: count };
    });
  };

  sendChat = (message) => {
    /* sendPromise("/app/create-room/direct", "lepszykowal").then((m) => {
      console.log(m);
      if (m.isSuccess) {
        this.setActiveChatId(m.chatRoomId);
      }
    });*/
    api.sendChat(this.state.activeChatId, message);
  };

  setLastRead = (chatId) => {
    api.setLastRead(chatId);
  };

  onLastRead = (msg) => {
    let m = JSON.parse(msg.body);
    this.updateChatRoom(m.chatRoomId, (chat) => {
      return { unreadCount: 0 };
    });
  };

  onNotifyUpdated = (msg) => {
    let m = JSON.parse(msg.body);
    let type = msg.headers["type"];
    if (type == "new-room") {
      getChatRoomList(this.props.myUserId).then((rooms) =>
        this.setChatRoomList(rooms)
      );
    }
  };

  onConnected = () => {
    console.log("connected");
    api.subscribe(
      `/user/${this.props.myUserId}/queue/last-read`,
      this.onLastRead,
      {}
    );
    api.subscribe(
      `/user/${this.props.myUserId}/queue/r`,
      (msg) => api.handleResponse(msg),
      {}
    );
    api.subscribe(
      `/user/${this.props.myUserId}/queue/notify-updated`,
      this.onNotifyUpdated,
      {}
    );
    getChatRoomList(this.props.myUserId).then((rooms) =>
      this.setChatRoomList(rooms)
    );
  };
  onError = (err) => {
    console.log(err);
  };

  onMessageReceived = (msg) => {
    let m = JSON.parse(msg.body);
    if (this.state.activeChatId == m.chatRoomId) {
      this.board.current.handleNewMessage(m);
      this.setLastRead(this.state.activeChatId);
    }
    this.updateRoomListFromMsg(m);
    const config = this.context;
    if (config.currentStatus == "online") {
      if (document.visibilityState !== "visible") {
        let audio = new Audio(soundFile);
        audio.play();
      }
    }
    console.log(config);
  };

  updateConfig = (cfg) => {
    this.props.setConfig(cfg);
  };

  componentDidUpdate = (pp, ps) => {
    if (ps.chatRoomList !== this.state.chatRoomList) {
      console.log("Lubię kotlety - ale nie mielone.");
      if (api != null && api.connected) this.updateSubscriptions();
    }
    if (pp.myUserId !== this.props.myUserId) {
      if (this.props.myUserId !== undefined) {
        this.connect(this.props.myUserId);
      }
    }
  };

  render = () => {
    return (
      <ChatContext.Provider
        value={{
          myUserId: this.props.myUserId,
          activeChatId: this.state.activeChatId,
          setActiveChatId: this.setActiveChatId,
          chatRoomList: this.state.chatRoomList,
          setChatRoomList: this.setChatRoomList,
          sendChat: this.sendChat,
          api,
        }}
      >
        <div id="MainContent" style={{ visibility: "hidden" }}>
          <div id="messagesContent">
            <MessageBoard
              ref={this.board}
              {...{
                activeChatId: this.state.activeChatId,
                myUserId: this.props.myUserId,
                sendChat: this.sendChat,
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
