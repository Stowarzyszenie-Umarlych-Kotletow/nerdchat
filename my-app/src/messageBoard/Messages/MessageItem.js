import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./MessageItem.css";
import { UserConfig } from "../../context";
import formatUrls from "./MessageItemTools";

const MessageItem = ({ message, myNick }) => {
  const cfg = useContext(UserConfig);
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
  for (let i = 0; i < pollData.options.length; i++)
    pollValuesSum += pollData.options[i].value;
  return (
    <div>
      <div className="textbox" style={getStyle(id)}>
        <div className="textHeader">
          {senderName} - &#9202;{" "}
          {new Date(Date.parse(sentAt)).toLocaleTimeString()}
        </div>
        <h1>
          {formatUrls(content).map((d) => {
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
      </div>
    </div>
  );
};

// PropTypes
MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageItem;
