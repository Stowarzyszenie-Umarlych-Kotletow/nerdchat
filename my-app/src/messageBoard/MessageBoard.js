import { Component } from "react";
import "./MessageBoard.css";
import "../common/scrollbar.css";
import Messages from "./Messages/Messages";
import AddMessage from "./AddMessage";
import React from "react";
import { UserConfig } from "../context";
import EmojiBox from "./EmojiBox/EmojiBox";
import FileBox from "./FileBox";
import { dragElement, mergeReactionDicts } from "../common/utils";
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
    openFile: false,
    chatCodeValid: true,
    adminPermissions: false,
    showReactions: false,
    reactMessageId: -2077,
    showAddReaction: false,
    showFullScreen: false,
    fullScreenImgSrc: "",
  };

  container = React.createRef();

  scrollDown(force = false) {
    let obj = document.getElementById("MessageContainer");
    let offset = obj.scrollTop;
    let scrollHeight = obj.scrollHeight;
    let clientHeight = obj.clientHeight;
    let height = scrollHeight - clientHeight;
    if (scrollHeight - offset <= 10 || force) {
      document.getElementById("MessageContainer").scrollTop = height;
    }
  }

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

  componentDidMount = () => {
    if (this.container) {
      this.container.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight });
      });
    }
  };

  componentDidUpdate = (prevProps) => {
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
          let showOptions = chat.joinCode !== null && chat.joinCode !== "";
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
              adminPermissions: chat.permissions === "ADMIN",
            });
          break;
        }
      }
    }
    if (this.props.activeChatId !== prevProps.activeChatId) {
      this.setState({ openOptions: false });
    }
    this.scrollDown();

    dragElement(document.getElementById("showReactions"));
    dragElement(document.getElementById("addReaction"));
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

  mergeReactions = (data) => {
    this.setState({
      reactions: mergeReactionDicts(this.state.reactions, data),
    });
  };

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
                  </div>
                ) : null}
              </div>
            </div>
            <div
              ref={this.container}
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
                        key={`${emoji.id}`}
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
                      <p
                        key={`${r.emojiId}`}
                        style={{
                          color: this.context.textColorMain,
                          backgroundColor:
                            this.context.accentsColor +
                            (r.selected ? "99" : "00"),
                          borderRadius: "7px",
                        }}
                      >
                        {findEmoji(this.props.emojis, r.emojiId).dataText +
                          "" +
                          r.count}
                      </p>
                    ))}
                  </div>
                </div>
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
                  fullscreen={(imgsrc) => {
                    this.setState({
                      showFullScreen: true,
                      fullScreenImgSrc: imgsrc,
                    });
                  }}
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
        {this.state.showFullScreen ? (
          <div
            className="fullscreen"
            onClick={() => {
              this.setState({ showFullScreen: false });
            }}
          >
            <img
              className="fullscreenImage"
              src={this.state.fullScreenImgSrc}
              alt=""
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default MessageBoard;
