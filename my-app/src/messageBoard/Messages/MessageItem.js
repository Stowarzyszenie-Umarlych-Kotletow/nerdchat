import React, { useContext, useCallback } from "react";
import PropTypes from "prop-types";
import "./MessageItem.css";
import { UserConfig, ChatContext } from "../../context";
import { formatUrls, getEmojiFromLabels } from "./MessageItemTools";
import { getAttachmentUrl, findEmoji } from "../../common/Api";

const MessageItem = ({
  message,
  myNick,
  showReactions,
  addReaction,
  reactions,
  fullscreen
}) => {
  const cfg = useContext(UserConfig);
  const chat = useContext(ChatContext);
  // get style of message box depending on whose information is it
  const getStyle = () => {
    if (message.senderNickname === myNick) {
      return {
        fontSize: String(12 * cfg.fontSizeMultiplier) + "px",
        background: "#262626",
        color: cfg.textColorUser,
        marginLeft: "60%",
        marginRight: "1%",
        float: "right",
      };
    } else {
      return {
        fontSize: String(12 * cfg.fontSizeMultiplier) + "px",
        background: "#696969",
        color: cfg.textColorMain,
        marginLeft: "1%",
      };
    }
  };

  const getReations = () => {
    let result = Object.values(reactions)
      .sort(function (a, b) {
        return b.count - a.count;
      })
      .slice(0, 3);
    let reactionString = "";
    result.forEach((r) => {
      reactionString +=
        findEmoji(chat.emojis, r.emojiId).dataText +
        " " +
        String(r.count) +
        " ";
    });
    if (reactionString !== "") reactionString += "     ";
    return reactionString;
  };

  const hasPoll = false;
  const pollData = {
    pollName: "Poll name",
    options: [
      {
        name: "Option 1",
        value: 5,
      },
      {
        name: "Option 2",
        value: 2,
      },
    ],
  };

  const { senderName, sentAt, content, id } = message;
  let pollValuesSum = 0;
  const hasFile = message.attachment !== null;
  const hasImage = hasFile && message.attachment.type === "IMAGE";
  const hasVideo = hasFile && message.attachment.type === "VIDEO";

  for (let i = 0; i < pollData.options.length; i++)
    pollValuesSum += pollData.options[i].value;
  return (
    <div>
      <div className="textbox" style={getStyle(id)}>
        <div className="textHeader">
          {senderName} - &#9202;{" "}
          {new Date(Date.parse(sentAt)).toLocaleTimeString()}
        </div>
        {hasImage ? (
          <div>
            <img
              src={getAttachmentUrl(message.messageId, message.attachment.id)}
              height="100%"
              width="100%"
              onClick={()=> {fullscreen(getAttachmentUrl(message.messageId, message.attachment.id))}}
            ></img>
          </div>
        ) : null}
        {hasVideo ? (
          <div>
            <video
              width="100%"
              height="100%"
              src={getAttachmentUrl(message.messageId, message.attachment.id)}
              controls
            >
              Your browser does not support the video element.
            </video>
          </div>
        ) : null}
        <h1 style={{ marginBottom: "10px" }}>
          {hasFile && !hasImage && !hasVideo ? (
            <a
              style={{
                color: cfg.textColorUser,
                fontSize: "16px",
              }}
              href={getAttachmentUrl(message.messageId, message.attachment.id)}
            >
              📥{message.attachment.name}
              <br />
            </a>
          ) : null}
          {formatUrls(getEmojiFromLabels(content, chat.emojis)).map((d) => {
            return d;
          })}
        </h1>
        {hasPoll ? (
          <div className="pollBox">
            <label
              style={{
                fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
                fontWeight: "bold",
              }}
            >
              {" "}
              Ankieta - {pollData.pollName}{" "}
            </label>
            {pollData.options.map((option, id) => (
              <div
                className="pollOption"
                style={{
                  fontSize: String(14 * cfg.fontSizeMultiplier) + "px",
                  fontWeight: "bold",
                }}
              >
                <input type="checkbox" id={"box-" + id} />
                <label for={"box-" + id}>{option.name}</label>

                <div
                  className="pollBarTrack"
                  style={{ backgroundColor: cfg.backgroundColor }}
                >
                  <div
                    className="pollBar"
                    style={{
                      width: String((100 * option.value) / pollValuesSum) + "%",
                      backgroundColor: cfg.accentsColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div
          className="reactions"
          datatext={getReations()}
          style={{ fontSize: String(11 * cfg.fontSizeMultiplier) + "px" }}
          onClick={() => showReactions(message.messageId)}
        >
          <input
            type="button"
            value="+"
            className="newReactionButton"
            onClick={(e) => {
              e.stopPropagation();
              addReaction(message.messageId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

// PropTypes
MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageItem;
