import { Component } from 'react';
import './MessageBoard.css';
import Messages from './Messages'
import AddMessage from './AddMessage'


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
  addMessage = (content, sender) => {
    // create a new message object
    const newMessage = {
      content: content, 
      id: this.state.messages.length, 
      sender: sender, 
      time: new Date().getMinutes() < 10? String() + new Date().getHours() + ':0' + new Date().getMinutes(): String() + new Date().getHours() + ':' + new Date().getMinutes()
    }
    // check if user hasn't sent a hollow message, or just
    if (content.trim() != '')
    {
      this.setState({ messages: [...this.state.messages, newMessage]})
    }  
  }  
  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    return (
      <div id="MessageBoard">
        <div style={{width:"100%"}}>
          <div id="MessageContainer">
            <Messages messages={this.state.messages} />
          </div>
          <AddMessage addMessage={this.addMessage} />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    document.getElementById("MessageContainer").scrollTop = document.getElementById("MessageContainer").scrollHeight;
  }
}

export default MessageBoard;
