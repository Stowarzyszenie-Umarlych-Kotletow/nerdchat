import { Component } from 'react';
import './MessageBoard.css';
import Messages from './Messages'
import AddMessage from './AddMessage'
import PropTypes from 'prop-types';


class MessageBoard extends Component {
  state = {
    messages: [
      {
        id: 0,
        sender: 'Amy',
        content: 'Take out the trash',
        time: '14:32'
      },
      {
        id: 1,
        sender: 'Amy',
        content: 'And do it quick',
        time: '14:33'
      },
      {

        id: 2,
        sender: 'Amy',
        content: 'I am walking our dog',
        time: '14:36'
      },
      {

        id: 3,
        sender: 'Me',
        content: 'Buy me some coke',
        time: '15:14'
      }
    ]
  }

  // Add Message to MessageBoard
  addMessage = (content) => {
    const newMessage = {
      content: content, 
      id: this.state.messages.length, 
      sender: 'Me', 
      time: String() + new Date().getHours() + ':' + new Date().getMinutes()}
    console.log(newMessage.id);
    this.setState({ messages: [...this.state.messages, newMessage]})
  }

  

  render() {
    return (
      <div className="MessageBoard" >
        <div className="container">
          <Messages messages={this.state.messages} />
          <AddMessage addMessage={this.addMessage} />
        </div>
      </div>
    );
  }

}

// PropTypes
MessageBoard.propTypes = {
    //messages: PropTypes.array.isRequired
}

export default MessageBoard;
