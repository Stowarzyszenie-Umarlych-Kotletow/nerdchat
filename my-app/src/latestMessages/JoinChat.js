import React, { Component } from "react";
import { ChatContext } from "../context";
import "./JoinChat.css";

class JoinChat extends Component {
  state = {
    chatCode: "",
    friend: "",
    newChatName: ""
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmitChatCode = (e) => {
    this.setState({ chatCode: "" });
    this.props.setJoinChatOpen(false);
  };

  onSubmitNewChat = (e) => {
    this.setState({ newChatName: "" });
    this.props.setJoinChatOpen(false);
  }

  onSubmitFriend = (e) => {
    // join new 1to1 chat with friend
    this.context.api.joinDirectChat(this.state.friend).then(
      (m) => {
        if (m.success) {
          this.props.setJoinChatOpen(false);
          this.setState({ friend: "" });
        } else {
          alert("User not found");
        }
      },
      (err) => {
        alert("jest większy problem nw byczq");
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
          <div style={{marginBottom:"30px"}}>
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
          <div style={{marginBottom:"30px"}}>
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
