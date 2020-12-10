import LatestMessage from "./latestMessage";
import "./LeftSideLatest.css";
import AddMessage from "../messageBoard/AddMessage";
import { getChatRoomList } from "../common/Api";
import { ChatContext } from "../App";
import { useEffect, useContext } from "react";
import { UserConfig } from "./../context";

function wrapText(text) {
  if (text != null && text.length > 25) {
    let temp = text.substring(0, 25);
    return temp + "...";
  }
  return text;
}

const LeftSideLatest = ({ chatRoomList, setActiveChatId, setLastRead }) => {
  const cfg = useContext(UserConfig);
  return chatRoomList === undefined
    ? null
    : chatRoomList.map((m) => {
        return (
          <div
            className="latestMessage"
            key={m.chatRoomId}
            style={{
              backgroundColor: cfg.colorAccents,
              color: cfg.textColorMain,
              fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
            }}
            onClick={(e) => {
              setActiveChatId(m.chatRoomId);
              setLastRead(m.chatRoomId);
              // change chat name
              document
                .getElementById("chatName")
                .setAttribute("dataText", m.chatName);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                className="latestMessageName"
                style={{ fontSize: String(22 * cfg.fontSizeMultiplier) + "px" }}
              >
                {m.chatName}
              </div>
              {m.unreadCount > 0 ? (
                <div className="unreadMessagesCount">{m.unreadCount}</div>
              ) : null}
            </div>
            <div className="latestMessageDate">
              {new Date(Date.parse(m.lastMessage.sentAt)).toDateString()}
            </div>
            <div className="latestMessageMessage">
              {wrapText(m.lastMessage.content)}
            </div>
          </div>
        );
      });
};

export default LeftSideLatest;
