import './LeftSideContent.css';
import React from 'react';
import LeftSideTitle from './LeftSideTitle';
import LeftSideLatest from './LeftSideLatest';
import '../common/scrollbar.css'
import {ChatContext} from '../App'


function LeftSide(props) {
    return (
        <React.Fragment>
            <div className="leftSideContainer" >
            <h1 align='center' style={{backgroundColor:'#ffc933', fontWeight:'bold'}}>Nerdchat App</h1>
                <LeftSideTitle />
                <div className="latestMessagesContainer">
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
export default LeftSide;