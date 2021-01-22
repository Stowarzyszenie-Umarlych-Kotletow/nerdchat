import { Component } from "react";
import "./MessageBoard.css";
import "../common/scrollbar.css";
import Messages from "./Messages/Messages";
import AddMessage from "./AddMessage";
import React from "react";
import { UserConfig } from "../context";
import EmojiBox from "./EmojiBox/EmojiBox";
import CreatePollBox from "./CreatePollBox";

export class MessageBoard extends Component {
  static contextType = UserConfig;
  state = {
    chatName: "",
    chatCode: "",
    chatCodeInput: "",
    messages: [],
    showOptions: false,
    openOptions: false,
    openEmoji: false,
    openCreatePoll: false,
    chatCodeValid: true,
    adminPermissions: true,
  };

  handleNewMessage = (msg) => {
    for (let m of this.state.messages) {
      if (m.messageId === msg.messageId) return;
    }
    this.setState({ messages: [...this.state.messages, msg] });
  };

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, ps) => {
    console.log("Active chat ID: " + this.props.activeChatId);
    if (
      prevProps.activeChatId !== this.props.activeChatId &&
      this.props.activeChatId !== undefined
    ) {
      this.props.api
        .getChatRoomMessages(this.props.activeChatId)
        .then((m) => this.setState({ messages: m }));
    }

    if (this.props.activeChatId != null && this.props.roomList != null) {
      for (let chat of this.props.roomList) {
        if (chat.chatRoomId === this.props.activeChatId) {
          let chatCode = chat.joinCode;
          let chatName = chat.chatName;
          let showOptions = chat.joinCode !== "";
          if (
            chatCode !== this.state.chatCode ||
            chatName !== this.state.chatName ||
            showOptions !== this.state.showOptions
          )
            this.setState({
              chatCode,
              chatName,
              chatCodeInput: chatCode,
              showOptions,
            });
          break;
        }
      }
    }
    if (this.props.activeChatId !== prevProps.activeChatId) {
      this.setState({ openOptions: false });
    }
    document.getElementById(
      "MessageContainer"
    ).scrollTop = document.getElementById("MessageContainer").scrollHeight;
  };

  submitNewChatCode = () => {
    this.props.api.stomp
      .setChatroomCode(this.props.activeChatId, this.state.chatCodeInput)
      .then((m) => {
        this.setState({ chatCodeValid: false });
      });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, chatCodeValid: true });
  };

  switchOpenEmoji = () => {
    this.setState({ openEmoji: !this.state.openEmoji });
  };

  switchOpenCreatePoll = () => {
    this.setState({ openCreatePoll: !this.state.openCreatePoll });
  };

  // Add Message to MessageBoard
  addMessage = (content) => {
    // create a new message object

    if (content.trim() !== "") {
      this.props.sendChat(content.trim());
      //sendMessage(this.props.myUserId, this.props.activeChatId, content);
    }
  };
  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    return (
      <div
        style={{
          backgroundColor: this.context.backgroundColor,
          height: "100%",
        }}
      >
        <div id="MessageBoard">
          <div style={{ width: "100%", color: this.context.textColorMain }}>
            <div id="chatHeader">
              <div id="chatName" datatext={this.state.chatName} />
              <div
                className={this.state.showOptions ? "" : "hidden"}
                id="chatOptionsButton"
                onClick={() =>
                  this.setState({ openOptions: !this.state.openOptions })
                }
              >
                {this.state.openOptions ? (
                  <div
                    id="chatOptions"
                    style={{ color: this.context.textColorUser }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {this.state.adminPermissions ? (
                      <div>
                        <input
                          id="chatCodeField"
                          type="text"
                          name="chatCodeInput"
                          placeholder=""
                          value={this.state.chatCodeInput}
                          style={{ color: this.context.textColorUser }}
                          onClick={() =>
                            navigator.clipboard.writeText(this.state.chatCode)
                          }
                          onChange={this.onChange}
                        />
                        <input
                          type="button"
                          value="Set Code"
                          className="optionButton"
                          onClick={this.submitNewChatCode}
                          style={{
                            color: this.context.textColorUser,
                            width: "20%",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        id="copyOption"
                        onClick={() =>
                          navigator.clipboard.writeText(this.state.chatCode)
                        }
                        datatext={this.state.chatCode}
                      />
                    )}
                    <div
                      id="chatCodeFieldLabel"
                      datatext="ChatCode - click to copy!"
                      onClick={() =>
                        navigator.clipboard.writeText(this.state.chatCode)
                      }
                    />
                    {this.state.chatCodeValid ? null : (
                      <div
                        id="invalidCodeError"
                        datatext="Invalid or taken Code"
                      />
                    )}
                    <input
                      type="button"
                      value="Create a poll"
                      className="optionButton"
                      onClick={this.switchOpenCreatePoll}
                      style={{
                        color: this.context.textColorUser,
                        marginTop: "10px",
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div
              id="MessageContainer"
              style={{ color: this.context.textColorUser }}
            >
              {this.state.openEmoji ? (
                <EmojiBox
                  {...{
                    switchOpenEmoji: this.switchOpenEmoji,
                  }}
                />
              ) : null}
              {this.props.activeChatId === null ? (
                <div style={{ fontSize: "40px", textAlign: "center" }}>
                  Choose a chat to start talking with your friends!
                </div>
              ) : (
                <Messages messages={this.state.messages} />
              )}
            </div>
            {this.props.activeChatId === null ? null : (
              <AddMessage
                addMessage={this.addMessage}
                switchOpenEmoji={this.switchOpenEmoji}
              />
            )}
          </div>
        </div>
        {this.state.openCreatePoll ? (
          <CreatePollBox switchOpenCreatePoll={this.switchOpenCreatePoll} />
        ) : null}
      </div>
    );
  }
}

export default MessageBoard;
