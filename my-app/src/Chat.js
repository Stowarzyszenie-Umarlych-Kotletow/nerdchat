import "./Chat.css";
import React, { useState, useEffect, useContext, useCallback } from "react";
import LeftSide from "./latestMessages/LeftSideContent";
import { MessageBoard } from "./messageBoard/MessageBoard";
import { getChatRoomList } from "./common/Api";
import config from "./common/endpoints.json";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
export const ChatContext = React.createContext();

var stompClient = null;
const Chat = ({ myUserId, setConfig }) => {
  const [activeChatId, setActiveChatId] = useState();
  const [chatRoomList, setChatRoomList] = useState([]);
  const [subscribed, setSubscribed] = useState({});

  const connect = () => {
    stompClient = Stomp.over(() => new WebSocket(config.wsUrl));
    stompClient.connect({}, onConnected, onError);
  };
  const shouldBeSubscribed = (channel) => {
    return true;
  };
  const subscribeObj = (channelId, s, h) => {
    let obj = s[channelId];
    if (obj != undefined && obj.active) return obj;
    obj = {
      sub: stompClient.subscribe(`/topic/channel/notify/${channelId}`, h, {
        id: channelId,
      }),
      active: true,
    };
    return obj;
  };

  const updateSubscriptions = () => {
    let newSubs = {};
    chatRoomList.forEach((c) => {
      console.log(c);
      if (shouldBeSubscribed(c)) {
        newSubs[c.chatRoomId] = subscribeObj(
          c.chatRoomId,
          subscribed,
          onMessageReceived
        );
      } else {
        let obj = newSubs[c.chatRoomId];
        if (obj != undefined && obj != null && obj.active) {
          obj.sub.unsubscribe();
          obj.active = false;
        }
      }
    });
    console.log(newSubs);
    setSubscribed(newSubs);
  };

  const sendChat = (message) => {
    stompClient.send(
      "/app/send-chat",
      {},
      JSON.stringify({
        channelId: activeChatId,
        senderId: myUserId,
        content: message,
      })
    );
  };

  const setLastRead = (chatId) => {
    console.log(chatId);
    stompClient.send(
      "/app/last-read",
      {},
      JSON.stringify({
        channelId: chatId,
        userId: myUserId,
      })
    );
  };

  const onConnected = () => {
    console.log("connected");
    getChatRoomList(myUserId).then((rooms) => setChatRoomList(rooms));
  };
  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (msg) => {
    console.log(`msg: ${msg.body}`);
    console.log(`test: ${this}`);
    let m = JSON.parse(msg.body);

    console.log("INSIDE");

    setLastRead(activeChatId);
  };

  const updateConfig = (cfg) => {
    setConfig(cfg);
  };

  useEffect(() => {
    console.log("Lubię kotlety - ale nie mielone.");
    if (stompClient != null && stompClient.connected) updateSubscriptions();
  }, [chatRoomList]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (myUserId !== undefined) {
      connect();
    }
  }, [myUserId]);

  useEffect(() => {
    console.log(`now ${activeChatId}`);
  }, [activeChatId]);

  return (
    <ChatContext.Provider
      value={{
        myUserId,
        activeChatId,
        setActiveChatId,
        chatRoomList,
        setChatRoomList,
        sendChat,
      }}
    >
      <div id="MainContent" style={{ visibility: "hidden" }}>
        <div id="messagesContent">
          <MessageBoard {...{ activeChatId, myUserId, sendChat }} />
        </div>
        <LeftSide {...{ updateConfig }} />
      </div>
    </ChatContext.Provider>
  );
};

export default Chat;
