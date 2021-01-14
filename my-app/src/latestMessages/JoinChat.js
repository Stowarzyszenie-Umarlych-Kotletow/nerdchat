import React, { Component } from "react";
import { ChatContext } from "../context";
import "./JoinChat.css";

class JoinChat extends Component {
  state = {
    chatCode: "",
    friend: "",
    newChatName: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmitChatCode = () => {
    this.context.api.joinChatByCode(this.state.chatCode).then((m) => {
      if (m.success) {
        this.setState({ chatCode: "" });
        // join new Chat
        this.props.setJoinChatOpen(false);
      } else {
        alert("Invalid code");
      }
    });
  };

  onSubmitNewChat = () => {
    this.context.api.createGroupChat(this.state.newChatName).then((m) => {
      if (m.success) {
        this.setState({ newChatName: "" });
        // join new Chat
        this.props.setJoinChatOpen(false);
      } else {
        alert("Could not create a new group.");
      }
    });
  };

  onSubmitFriend = () => {
    // join new 1to1 chat with friend
    this.context.api.joinDirectChat(this.state.friend).then(
      (m) => {
        if (m.success) {
          this.props.setJoinChatOpen(false);
          this.setState({ friend: "" });
        } else {
          alert("User not found");
        }
      }
    );
  };

  //✎
  render() {
    return (
      <div>
        <div id="joinChatBox">
          <div
            className="XButton"
            onClick={() => this.props.setJoinChatOpen(false)}
          />
          <div style={{ marginBottom: "30px" }}>
            Join group chat with ChatCode!
            <input
              className="joinChatField"
              type="text"
              name="chatCode"
              value={this.state.chatCode}
              placeholder="Eg. d35ffa91"
              onChange={this.onChange}
            />
            <input
              className="joinChatButton"
              type="button"
              value="Join Chat!"
              onClick={this.onSubmitChatCode}
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            Find your friend with his nick!
            <input
              className="joinChatField"
              type="text"
              name="friend"
              value={this.state.friend}
              placeholder="Eg. miko3412"
              onChange={this.onChange}
            />
            <input
              className="joinChatButton"
              type="button"
              value="Chat With Friend!"
              onClick={this.onSubmitFriend}
            />
          </div>
          <div>
            To make a new chat create a name!
            <input
              className="joinChatField"
              type="text"
              name="newChatName"
              value={this.state.newChatName}
              placeholder="Eg. Suuper chat name!"
              onChange={this.onChange}
            />
            <input
              className="joinChatButton"
              type="button"
              value="Create new chat!"
              onClick={this.onSubmitNewChat}
            />
          </div>
        </div>
      </div>
    );
  }
}

JoinChat.contextType = ChatContext;

export default JoinChat;
