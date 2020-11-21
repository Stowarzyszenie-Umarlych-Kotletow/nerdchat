import './LeftSideContent.css';
import React, { Component } from 'react';
import LeftSideTitle from './LeftSideTitle';
import LeftSideLatest from './LeftSideLatest';
import SettingsBox from './SettingsBox/SettingsBox';
import '../common/scrollbar.css'
import {ChatContext} from '../App'


class LeftSide extends Component{
    
    onSettingsButtonClick = () => {
        document.getElementById("EmojiBox").style.visibility = 'hidden';
        document.getElementById("SettingsBox").style.visibility = 'visible';
    }

    render() {
        return (
            <React.Fragment>
                <div className="leftSideContainer" >
                    <div className="leftSideSettingsIcon" onClick={this.onSettingsButtonClick}>
                    <p>⚙️</p>
                    </div>
                    <div style={{height:"5%"}}><h1 align='center' style={{backgroundColor:'#ffc933', fontWeight:'bold'}}>Nerdchat App</h1></div>
                    <LeftSideTitle />
                    <SettingsBox />
                    <div className="latestMessagesContainer" style={{height:"90%"}}>
                    <ChatContext.Consumer>
                        {({chatRoomList, setActiveChatId}) => {
                            console.log(chatRoomList);
                            return <LeftSideLatest {...{chatRoomList, setActiveChatId}}/>
                        }}
                    
                        
                    
                    </ChatContext.Consumer>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LeftSide;