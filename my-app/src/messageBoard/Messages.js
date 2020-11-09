import { Component } from 'react';
import MessageItem from './MessageItem'


class Messages extends Component {
  render() {
    // creating rendering object for every message
    return this.props.messages.map((message) => (
        <MessageItem key={message.id} message={message}/>
    ));
  }

}

export default Messages;
