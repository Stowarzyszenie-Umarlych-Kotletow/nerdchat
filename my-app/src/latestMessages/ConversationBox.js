import React, { Component, useContext, useState } from "react";
import ConversationItem from "./ConversationItem";
import SettingsBox from "./SettingsBox/SettingsBox";
import UserControlBox from "./userControlBox/UserControlBox";
import "./ConversationBox.css";
import "../common/scrollbar.css";
import { configGet } from "../common/config";
import { ChatContext } from "../Chat";
import { UserConfig } from "../context";

const ConversationBox = ({ updateConfig, setLastRead }) => {
  const cfg = useContext(UserConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <React.Fragment>
      <div className="conversationBoxContainer">
        <div style={{ height: "69px" }}>
          <div id="appTitleBox" style={{ backgroundColor: cfg.colorAccents }}>
            <h1
              style={{
                marginLeft: "25px",
                color: cfg.textColorMain,
              }}
            >
              Nerdchat
            </h1>
          </div>
          <div id="textLatestMessages" style={{ color: cfg.textColorUser }}>
            Latest Messages{" "}
          </div>
        </div>
        {settingsOpen ? (
          <SettingsBox {...{ updateConfig, setSettingsOpen }} />
        ) : null}
        <div id="conversationsContainer">
          <ChatContext.Consumer>
            {({ chatRoomList, setActiveChatId }) => {
              console.log(chatRoomList);
              return (
                <ConversationItem
                  {...{ chatRoomList, setActiveChatId, setLastRead }}
                />
              );
            }}
          </ChatContext.Consumer>
        </div>
        <UserControlBox {...{ settingsOpen, setSettingsOpen }} />
      </div>
    </React.Fragment>
  );
};

export default ConversationBox;
