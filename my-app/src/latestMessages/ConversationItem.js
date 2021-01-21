import "./ConversationItem.css";
import { useContext } from "react";
import { ChatContext, UserConfig } from "../context";
import {getEmojiFromLabels} from "../messageBoard/Messages/MessageItemTools";

function wrapText(text) {
  let len = 36;
  if (text != null && text.length > len) {
    let temp = text.substring(0, len);
    return temp + "...";
  }
  return text;
}

const ConversationItem = ({ chatRoomList, setActiveChatId, setLastRead }) => {
  const cfg = useContext(UserConfig);
  const chatContext = useContext(ChatContext);
  return chatRoomList === undefined
    ? null
    : chatRoomList.map((m) => {
        let date = new Date(Date.parse(m.lastMessage.sentAt));
        let today = new Date();
        let isToday =
          (date.getDate(), date.getMonth(), date.getFullYear()) ===
          (today.getDate(), today.getMonth(), today.getFullYear());
        let ifShaded = m.chatRoomId === chatContext.activeChatId;
        let opacity = ifShaded ? "0.6" : "1.0";
        return (
          <div
            className="latestMessage"
            key={m.chatRoomId}
            style={{
              backgroundColor: cfg.colorAccents,
              color: cfg.textColorMain,
              fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
              paddingTop: "5px",
              paddingLeft: "5px",
              opacity: opacity,
            }}
            onClick={(e) => {
              setActiveChatId(m.chatRoomId);
              setLastRead(m.chatRoomId);
              // change chat name
              document
                .getElementById("chatName")
                .setAttribute("datatext", m.chatName);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                zIndex: "1",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <img
                  src={
                    m.chatRoomType === "GROUP"
                      ? "/assets/NerdchatDefgGroupPic.png"
                      : `/assets/NerdchatDefPic${m.chatName.length % 9}.png`
                  }
                  alt={""}
                  style={{
                    height: "40px",
                    width: "40px",
                    fontSize: "12px",
                    marginRight: "5px",
                  }}
                />
                <div
                  className="latestMessageName"
                  style={{
                    fontSize: String(22 * cfg.fontSizeMultiplier) + "px",
                  }}
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
              {wrapText(m.lastMessage.senderName === null ? null :
                m.lastMessage.senderName + ": " + getEmojiFromLabels(m.lastMessage.content)
              )}
            </div>
          </div>
        );
      });
};

export default ConversationItem;
