import "./Chat.css";
import React, { Component } from "react";
import LeftSide from "./latestMessages/LeftSideContent";
import { MessageBoard } from "./messageBoard/MessageBoard";
import { getChatRoomList } from "./common/Api";
import config from "./common/endpoints.json";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
export const ChatContext = React.createContext();

var stompClient = null;
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

  setActiveChatId = (val) => {
    this.setState({ activeChatId: val });
  };
  setChatRoomList = (val) => {
    this.setState({ chatRoomList: val });
  };
  setSubscribed = (val) => {
    this.setState({ subscribed: val });
  };

  connect = () => {
    stompClient = Stomp.over(() => new WebSocket(config.wsUrl));
    stompClient.connect({}, this.onConnected, this.onError);
  };
  shouldBeSubscribed = (channel) => {
    return true;
  };

  subscribeObj = (channelId) => {
    let obj = this.state.subscribed[channelId];
    if (obj != undefined && obj.active) return obj;
    obj = {
      sub: stompClient.subscribe(
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
    this.state.chatRoomList.forEach((c) => {
      console.log(c);
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
    console.log(newSubs);
    this.setSubscribed(newSubs);
  };

  updateRoomListFromMsg = (msg) => {
    let now = new Date();
    let found = null;
    let newObj = [];
    for (let c of this.state.chatRoomList) {
      if (c.chatRoomId === msg.chatRoomId) {
        newObj.push(Object.assign({}, c, { lastMessage: msg }));
      } else {
        newObj.push(c);
      }
    }
    console.log(newObj);
    this.setChatRoomList(
      newObj.sort((a, b) => b.lastMessage.sentAt - a.lastMessage.sentAt)
    );
  };

  sendChat = (message) => {
    stompClient.send(
      "/app/send-chat",
      {},
      JSON.stringify({
        channelId: this.state.activeChatId,
        senderId: this.props.myUserId,
        content: message,
      })
    );
  };

  setLastRead = (chatId) => {
    console.log(chatId);
    stompClient.send(
      "/app/last-read",
      {},
      JSON.stringify({
        channelId: chatId,
        userId: this.props.myUserId,
      })
    );
  };

  onConnected = () => {
    console.log("connected");
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
  };

  updateConfig = (cfg) => {
    this.props.setConfig(cfg);
  };

  componentDidUpdate = (pp, ps) => {
    if (ps.chatRoomList !== this.state.chatRoomList) {
      console.log("Lubię kotlety - ale nie mielone.");
      if (stompClient != null && stompClient.connected)
        this.updateSubscriptions();
    }
    if (pp.myUserId !== this.props.myUserId) {
      if (this.props.myUserId !== undefined) {
        this.connect();
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
          <LeftSide updateConfig={this.updateConfig} />
        </div>
      </ChatContext.Provider>
    );
  };
}

export default Chat;
