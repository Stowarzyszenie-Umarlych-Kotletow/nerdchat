import { Component } from "react";
import MessageItem from "./MessageItem";
import { UserContext } from "../../context";

class Messages extends Component {
  render() {
    // creating rendering object for every message
    return this.props.messages === undefined
      ? null
      : this.props.messages.map((message) => (
          <UserContext.Consumer>
            {({ myUserId }) => {
              return (
                <MessageItem
                  key={message.messageId}
                  message={message}
                  myUserId={myUserId}
                />
              );
            }}
          </UserContext.Consumer>
        ));
  }
}

export default Messages;
