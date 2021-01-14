import { Component } from "react";
import "./MessageBoard.css";
import "../common/scrollbar.css";
import Messages from "./Messages/Messages";
import AddMessage from "./AddMessage";
import React from "react";
import { getMessages } from "../common/Api";
import { UserConfig } from "../context";
import EmojiBox from "./EmojiBox/EmojiBox";

export class MessageBoard extends Component {
  static contextType = UserConfig;
  state = {
    chatName: "",
    chatCode: "",
    messages: [],
    openOptions: false
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
      prevProps.activeChatId !== this.props.activeChatId &&
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

  // Add Message to MessageBoard
  addMessage = (content) => {
    // create a new message object
    
    if (content.trim() !== "") {
      console.log(this.props);
      this.props.sendChat(content.trim());
      //sendMessage(this.props.myUserId, this.props.activeChatId, content);
    }
  };
  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    return (
      <div   style={{ backgroundColor: this.context.colorBackground, height:"100%" }}>
        <div id="MessageBoard">
          <div style={{ width: "100%", color: this.context.textColorMain }}>
            <div id="chatHeader">
              <div
                id="chatName"
                datatext={this.state.chatName}
              />
              <div id="chatOptionsButton" onClick={() => this.setState({openOptions: !this.state.openOptions})} >
                {
                this.state.openOptions ? (<div id="chatOptions" style={{color: this.context.textColorUser}}>
                  <div id="copyOption" onClick={(e) => {e.stopPropagation(); navigator.clipboard.writeText(this.state.chatCode);}} datatext = {"Copy Chat Code to Clipboard"}/>
                  <input type="text" value="" id="clipboardAssistant" style={{display: "none"}}/> 
                  <label> Opcja 2 </label>
                  <br/>
                  <label> Opcja 3 </label>
                  <br/>
                  <label> Opcja 4 </label>
                  <br/>
                  <label> Opcja 5 </label>
                </div>)
                : null
                }
              </div>
            </div>
            <div id="MessageContainer" style={{color: this.context.textColorUser}}>
              <EmojiBox />
              {this.props.activeChatId === null ?  
              (
              <div style={{fontSize: "40px", textAlign: "center"}}>
                Choose a chat to start talking with your friends!
                </div>) 
              : <Messages messages={this.state.messages} />}
              
            </div>
            {this.props.activeChatId === null ? null : <AddMessage addMessage={this.addMessage}/>}
          </div>
        </div>
      </div>
    );
  }
}

export default MessageBoard;
