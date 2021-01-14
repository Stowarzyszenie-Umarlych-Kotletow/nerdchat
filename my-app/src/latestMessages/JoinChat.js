import React, { Component, setState } from "react";
import { ChatContext } from "../context";
import "./JoinChat.css";

class JoinChat extends Component {
  state = {
    chatCode: "",
    friend: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmitChatCode = (e) => {
    this.setState({ chatCode: "" });
    // join new Chat
    this.props.setJoinChatOpen(false);
  };

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
        alert("jest wienkszy problem nw byczq");
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
          <label> Enter Chat Code Here </label>
          <input
            className="joinChatField"
            type="text"
            name="chatCode"
            value={this.state.chatCode}
            placeholder="E. g. lion-lasagne-ford"
            onChange={this.onChange}
          />
          <input
            className="joinChatButton"
            type="button"
            value="Join Chat!"
            onClick={this.onSubmitChatCode}
          />
          <br />
          <br />
          <label> Enter Your Friends Nickname Here </label>

          <input
            className="joinChatField"
            type="text"
            name="friend"
            value={this.state.friend}
            placeholder="E. g. miko3412"
            onChange={this.onChange}
          />
          <input
            className="joinChatButton"
            type="button"
            value="Chat With Friend!"
            onClick={this.onSubmitFriend}
          />
        </div>
      </div>
    );
  }
}

JoinChat.contextType = ChatContext;

export default JoinChat;
