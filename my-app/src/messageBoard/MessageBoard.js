import { Component } from "react";
import "./MessageBoard.css";
import "../common/scrollbar.css";
import Messages from "./Messages/Messages";
import AddMessage from "./AddMessage";
import React, { useEffect } from "react";
import { getMessages, sendMessage } from "../common/Api";
import { UserConfig } from "../context";
import EmojiBox from "./EmojiBox/EmojiBox";

export class MessageBoard extends Component {
  static contextType = UserConfig;
  state = {
    chatName: "",
    chatCode: "Paróweczka :D",
    messages: [],
  };

  handleNewMessage = (msg) => {
    for (let m of this.state.messages) {
      if (m.messageId === msg.messageId) return;
    }
    this.setState({ messages: [...this.state.messages, msg] });
  };

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState) => {
    console.log("Active chat ID: " + this.props.activeChatId);
    if (
      prevProps.activeChatId != this.props.activeChatId &&
      this.props.activeChatId !== undefined
    ) {
      getMessages(this.props.activeChatId).then((m) =>
        this.setState({ messages: m })
      );
    }
    document.getElementById(
      "MessageContainer"
    ).scrollTop = document.getElementById("MessageContainer").scrollHeight;
  };

  openOptions = () => {
    var visibility = document.getElementById("chatOptions").style.visibility;
    if (visibility === "visible") visibility = "hidden";
    else visibility = "visible";
    document.getElementById("chatOptions").style.visibility = visibility;
  }

  // Add Message to MessageBoard
  addMessage = (content, sender, time) => {
    // create a new message object
    const newMessage = {
      content: content,
      id: this.state.messages.length,
      sender: sender,
      time: time,
    };
    // check if user hasn't sent a hollow message, or just whitespaces
    if (content.trim() !== "") {
      console.log(this.props);
      this.props.sendChat(content.trim());
      //sendMessage(this.props.myUserId, this.props.activeChatId, content);
    }
  };
  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    return (
      <div
        id="MessageBoard"
        style={{ backgroundColor: this.context.colorBackground }}
      >
        <div style={{ width: "100%", color: this.context.textColorMain }}>
          <div id="chatHeader">
            <div
              id="chatName"
              dataText={this.state.chatName}
            />
            <div id="chatOptionsButton" onClick={this.openOptions} >
              <div id="chatOptions" style={{color: this.context.textColorUser}}>
                <div id="copyOption" onClick={(e) => {e.stopPropagation(); navigator.clipboard.writeText(this.state.chatCode);}} dataText = {"Copy Chat Code to Clipboard"}/>
                <input type="text" value="chlebek" id="clipboardAssistant" style={{display: "none"}}/> 
                <label> Opcja 2 </label>
                <br/>
                <label> Opcja 3 </label>
                <br/>
                <label> Opcja 4 </label>
                <br/>
                <label> Opcja 5 </label>
              </div>
            </div>
          </div>
          <div id="MessageContainer">
            <EmojiBox />
            <Messages messages={this.state.messages} />
          </div>
          <AddMessage addMessage={this.addMessage} />
        </div>
      </div>
    );
  }
}

export default MessageBoard;
