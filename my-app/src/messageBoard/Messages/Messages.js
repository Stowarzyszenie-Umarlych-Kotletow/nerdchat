import { Component } from 'react';
import MessageItem from './MessageItem'
import {ChatContext} from '../../App'

class Messages extends Component {
  render() {
    // creating rendering object for every message
    return this.props.messages === undefined ? null :
      this.props.messages.map((message) => (
        <ChatContext.Consumer>
          {({myUserId}) => {
            return <MessageItem key={message.id} message={message} myUserId={myUserId}/>
          }}
        </ChatContext.Consumer>
        
    ));
  }

}

export default Messages;
