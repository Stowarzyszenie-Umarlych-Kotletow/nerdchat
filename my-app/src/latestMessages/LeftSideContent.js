import React, { Component } from 'react';
import LeftSideLatest from './LeftSideLatest';
import SettingsBox from './SettingsBox/SettingsBox';
import UserControlBox from './userControlBox/UserControlBox'
import {ChatContext} from '../App'
import './LeftSideContent.css';
import '../common/scrollbar.css'
import {lsgi} from '../common/Api'


class LeftSide extends Component{
    
    render() {
        return (
            <React.Fragment>
                <div className="leftSideContainer" >
                    <div style={{height:'69px'}}>
                        <div id="appTitleBox" style={{backgroundColor:lsgi('colorAccents')}}>
                            <h1 style={{marginLeft:'25px', color: lsgi('textColorMain')}}>Nerdchat</h1>
                        </div>
                        <div id="textLatestMessages" style={{color:lsgi('textColorUser')}}>Latest Messages </div>
                    </div>
                    <SettingsBox />
                    <div id="conversationsContainer">
                    <ChatContext.Consumer>
                        {({chatRoomList, setActiveChatId}) => {
                            console.log(chatRoomList);
                            return <LeftSideLatest {...{chatRoomList, setActiveChatId}}/>
                        }}
                    
                        
                    
                    </ChatContext.Consumer>
                    </div>
                    <UserControlBox />
                </div>
            </React.Fragment>
        )
    }
}

export default LeftSide;