import './LeftSideContent.css';
import React, { Component } from 'react';
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
                    <div style={{height:'69px'}}>
                        <div id="appTitleBox">
                            <div id="settingsIcon" onClick={this.onSettingsButtonClick}>⚙️</div>
                            <h1 style={{marginLeft:'15px'}}>Nerdchat App</h1>
                        </div>
                        <div id="textLatestMessages">Latest Messages </div>
                    </div>
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