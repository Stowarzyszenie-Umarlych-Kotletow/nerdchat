import { Component } from "react";
import MessageItem from "./MessageItem";
import { UserContext } from "../../context";

class Messages extends Component {
  static contextType = UserContext;
  render() {
    // creating rendering object for every message
    return this.props.messages === undefined ? null : this.props.messages
        .length === 0 ? (
      <div style={{ fontSize: "40px", textAlign: "center" }}>
        No messages - start the conversation by sending a message!
      </div>
    ) : (
      <>
        {this.props.messages.map((message) => {
          return (
            <MessageItem
              key={`${message.messageId}`}
              message={message}
              myNick={this.context.creds.nickname}
              showReactions={this.props.showReactions}
              addReaction={this.props.addReaction}
              reactions={this.props.reactions[message.messageId] || {}}
            />
          );
        })}
      </>
    );
  }
}

export default Messages;
