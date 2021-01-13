import LatestMessage from "./latestMessage";
import "./ConversationItem.css";
import AddMessage from "../messageBoard/AddMessage";
import { getChatRoomList } from "../common/Api";
import { ChatContext } from "../App";
import { useEffect, useContext } from "react";
import { UserConfig } from "../context";

function wrapText(text) {
  if (text != null && text.length > 25) {
    let temp = text.substring(0, 25);
    return temp + "...";
  }
  return text;
}

const ConversationItem = ({ chatRoomList, setActiveChatId, setLastRead }) => {
  const cfg = useContext(UserConfig);
  return chatRoomList === undefined
    ? null
    : chatRoomList.map((m) => {
        let date = new Date(Date.parse(m.lastMessage.sentAt));
        let today = new Date();
        let isToday =
          (date.getDate(), date.getMonth(), date.getFullYear()) ===
          (today.getDate(), today.getMonth(), today.getFullYear());
        return (
          <div
            className="latestMessage"
            key={m.chatRoomId}
            style={{
              backgroundColor: cfg.colorAccents,
              color: cfg.textColorMain,
              fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
              paddingTop: "5px",
              paddingLeft: "5px"
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
                zIndex: "1"
              }}
            >
              <div  style={{
                display: "flex",
                flexDirection: "row"}}
                >
                <img src={`/assets/NerdchatDefPic${m.chatName.length%9}.png`} alt={"Image is missing"} style={{height: "40px", width:"40px", fontSize: "12px", marginRight: "5px"}}/>
                <div
                  className="latestMessageName"
                  style={{ fontSize: String(22 * cfg.fontSizeMultiplier) + "px" }}
                >
                  {m.chatName}
                </div>
              </div>
              {m.unreadCount > 0 ? (
                <div className="unreadMessagesCount">{m.unreadCount}</div>
              ) : null}
            </div>
            <div className="latestMessageDate">
              {isToday ? date.toLocaleTimeString() : date.toDateString()}
            </div>
            <div className="latestMessageMessage">
              {wrapText(m.lastMessage.content)}
            </div>
          </div>
        );
      });
};

export default ConversationItem;
