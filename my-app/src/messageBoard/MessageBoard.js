import { Component } from "react";
import "./MessageBoard.css";
import "../common/scrollbar.css";
import Messages from "./Messages/Messages";
import AddMessage from "./AddMessage";
import React from "react";
import { UserConfig } from "../context";
import EmojiBox from "./EmojiBox/EmojiBox";
import CreatePollBox from "./CreatePollBox";
import FileBox from "./FileBox";
import { ChatContext } from "../context";
import { findEmoji } from "../common/Api";

export class MessageBoard extends Component {
  static contextType = UserConfig;
  state = {
    chatName: "",
    chatCode: "",
    chatCodeInput: "",
    messages: [],
    reactions: {},
    showOptions: false,
    openOptions: false,
    openEmoji: false,
    openCreatePoll: false,
    openFile: false,
    chatCodeValid: true,
    adminPermissions: true,
    showReactions: false,
    reactMessageId: -2077,
    showAddReaction: false,
  };

  handleNewMessage = (msg) => {
    for (let m of this.state.messages) {
      if (m.messageId === msg.messageId) return;
    }
    this.setState({ messages: [...this.state.messages, msg] });
  };

  handleChatChanged() {
    this.setState({ messages: [], reactions: {} });
    this.props.api
      .getChatRoomMessages(this.props.activeChatId)
      .then((m) => this.setState({ messages: m }));
    this.props.api
      .getReactions(this.props.activeChatId)
      .then((r) => this.setState({ reactions: r.data }));
  }

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, ps) => {
    console.log("Active chat ID: " + this.props.activeChatId);
    if (
      prevProps.activeChatId !== this.props.activeChatId &&
      this.props.activeChatId !== undefined
    ) {
      this.handleChatChanged();
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

  switchOpenFile = () => {
    this.setState({ openFile: !this.state.openFile });
  };

  showReactions = (messageId) => {
    this.setState({
      reactMessageId: messageId,
      showReactions: !this.state.showReactions,
      showAddReaction: false,
    });
  };

  showAddReaction = (messageId) => {
    this.setState({
      reactMessageId: messageId,
      showReactions: false,
      showAddReaction: !this.state.showAddReaction,
    });
  };

  addReaction = (emojiId) => {
    let isSelected = this.isReactionSelected(emojiId);
    this.stomp
      .reactToMessage(
        this.props.activeChatId,
        this.state.reactMessageId,
        emojiId,
        !isSelected
      )
      .then((data) => {
        this.mergeReactions(data);
      });
  };

  mergeReactions(data) {
    console.log("merging");
    let reactions = this.state.reactions;
    for (const [messageId, emoDict] of Object.entries(data)) {
      let r = reactions[messageId];
      for (const [emoId, reaction] of Object.entries(emoDict)) {
        let lastState =
          r !== undefined &&
          r[emoId] !== undefined &&
          r[emoId].selected === true;
        if (reaction.selected === null) reaction.selected = lastState;
      }
      reactions[messageId] = emoDict;
    }
    this.setState({ reactions });
  }

  isReactionSelected = (emojiId) => {
    let reacts = this.state.reactions[this.state.reactMessageId];
    return (
      reacts !== undefined &&
      reacts[emojiId] !== undefined &&
      reacts[emojiId].selected === true
    );
  };

  get stomp() {
    return this.props.api.stomp;
  }

  send(msg, file = null) {
    this.stomp.sendChat(this.props.activeChatId, msg, file);
  }

  // Add Message to MessageBoard
  addMessage = (content) => {
    if (content.trim() !== "") {
      this.send(content.trim());
    }
  };

  sendAttachment = (fileId) => {
    if (fileId != null)
      this.send(document.getElementById("textField").value, fileId);
  };

  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    let currentReactions =
      this.state.reactions[this.state.reactMessageId] || {};

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
              {this.state.openFile ? (
                <FileBox
                  switchOpenEmoji={this.switchOpenFile}
                  send={this.sendAttachment}
                />
              ) : null}
              {this.props.activeChatId === null ? (
                <div style={{ fontSize: "40px", textAlign: "center" }}>
                  Choose a chat to start talking with your friends!
                </div>
              ) : (
                <Messages
                  messages={this.state.messages}
                  reactions={this.state.reactions}
                  showReactions={this.showReactions}
                  addReaction={this.showAddReaction}
                />
              )}
            </div>
            {this.props.activeChatId === null ? null : (
              <AddMessage
                addMessage={this.addMessage}
                switchOpenEmoji={this.switchOpenEmoji}
                switchOpenFile={this.switchOpenFile}
              />
            )}
          </div>
        </div>
        {this.state.showAddReaction ? (
          <div id="addReaction">
            <div
              id="addReactionHeader"
              style={{
                backgroundColor: this.context.accentsColor,
                color: this.context.textColorMain,
              }}
            >
              Add Reaction
              <div
                className="XButton"
                onClick={() => this.setState({ showAddReaction: false })}
                style={{ float: "right" }}
              />
            </div>
            <div id="addReactionContent">
              {this.props.emojis.map((emoji) => (
                <input
                  type="button"
                  value={emoji.dataText}
                  className="addReactionButton"
                  onClick={() => this.addReaction(emoji.id)}
                  style={{
                    backgroundColor:
                      this.context.accentsColor +
                      (this.isReactionSelected(emoji.id) ? "99" : "00"),
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {this.state.showReactions ? (
          <div id="showReactions">
            <div
              id="showReactionsHeader"
              style={{
                backgroundColor: this.context.accentsColor,
                color: this.context.textColorMain,
              }}
            >
              Reactions
              <div
                className="XButton"
                onClick={() => this.setState({ showReactions: false })}
                style={{ float: "right" }}
              />
            </div>
            <div id="showReactionsContent">
              {Object.values(currentReactions).map((r) => (
                <p style={{ color: this.context.textColorMain }}>
                  {findEmoji(this.props.emojis, r.emojiId).dataText +
                    "" +
                    r.count}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {this.state.openCreatePoll ? (
          <CreatePollBox switchOpenCreatePoll={this.switchOpenCreatePoll} />
        ) : null}
      </div>
    );
  }
}

export default MessageBoard;
