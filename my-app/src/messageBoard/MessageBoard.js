import { Component } from 'react';
import './MessageBoard.css';
import '../common/scrollbar.css'
import Messages from './Messages/Messages'
import AddMessage from './AddMessage'
import EmojiBox from './EmojiBox/EmojiBox'
import React, {useEffect} from 'react'
import {getMessages, sendMessage} from '../common/Api'
import {configGet} from '../common/config'

class MessageBoard extends Component {
  state = {
    chatName: "chatName",
    messages: [

    ]
  }

  componentDidMount = () => {
    setInterval(() => {
      if(this.props.activeChatId !== undefined) {
        getMessages(this.props.activeChatId).then(m => this.setState({messages: m}));
      }
      
    }, 
    1000);
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log("Active chat ID: " + this.props.activeChatId);
    if(prevProps.activeChatId != this.props.activeChatId && this.props.activeChatId !== undefined) {
      getMessages(this.props.activeChatId).then(m => this.setState({messages: m}));
    }
    document.getElementById("MessageContainer").scrollTop = document.getElementById("MessageContainer").scrollHeight;
  }

  // Add Message to MessageBoard
  addMessage = (content, sender, time) => {
    // create a new message object
    const newMessage = {
      content: content, 
      id: this.state.messages.length, 
      sender: sender, 
      time: time
    }
    // check if user hasn't sent a hollow message, or just whitespaces 
    if (content.trim() !== '')
    {
      sendMessage(this.props.myUserId, this.props.activeChatId, content);
    }  
  }  
  // rendering a message box and components within like object Messages that takes care of rendering array of messages in chat
  render() {
    return (
      <div id="MessageBoard">
        <div style={{width:"100%"}}>
          <div id="chatName" dataText={this.state.chatName} style={{color:configGet('textColorMain')}}/>
          <div id="MessageContainer">
            <EmojiBox />
            <Messages messages={this.state.messages} />
          </div>
          <AddMessage addMessage={this.addMessage} />
        </div>
      </div>
    );
  }

}

export default MessageBoard;
