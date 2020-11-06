import { Component } from 'react';
import MessageItem from './MessageItem'
import PropTypes from 'prop-types';


class Messages extends Component {
  render() {
    return this.props.messages.map((message) => (
        <MessageItem key={message.id} message={message}/>
    ));
  }

}

Messages.propTypes = {
    //messages: PropTypes.array.isRequired,
    //message: PropTypes.object.isRequired
}

export default Messages;
