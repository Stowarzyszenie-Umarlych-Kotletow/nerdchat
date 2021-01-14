import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./MessageItem.css";
import { UserConfig } from "../../context";
import formatUrls from "./MessageItemTools";

const MessageItem = ({ message, myUserId }) => {
  const cfg = useContext(UserConfig);
  // get style of message box depending on whose information is it
  const getStyle = () => {
    if (message.senderId === myUserId) {
      return {
        fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
        background: "#262626",
        color: cfg.textColorUser,
        marginLeft: "60%",
        marginRight: "1%",
        float: "right",
      };
    } else {
      return {
        fontSize: String(16 * cfg.fontSizeMultiplier) + "px",
        background: "#696969",
        color: cfg.textColorMain,
        marginLeft: "1%",
      };
    }
  };

  const { senderName, sentAt, content, id } = message;
  return (
    <div>
      <div className="textbox" style={getStyle(id)}>
        <p>
          {senderName} - &#9202;{" "}
          {new Date(Date.parse(sentAt)).toLocaleTimeString()}
        </p>
        <h1>
          {formatUrls(content).map(function(d){
            return (d)
          })}
        </h1>
      </div>
    </div>
  );
};

// PropTypes
MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageItem;
