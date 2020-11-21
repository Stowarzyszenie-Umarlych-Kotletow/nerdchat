import './LeftSideContent.css';
import React, { Component } from 'react';
import LeftSideTitle from './LeftSideTitle';
import LeftSideLatest from './LeftSideLatest';
import '../common/scrollbar.css'
import {ChatContext} from '../App'


class LeftSide extends Component{
    
    onSettingsButtonClick = () => {
        let visibility = document.getElementById("SettingsBox").style.visibility;
        if (visibility === 'hidden') visibility = 'visible';
        document.getElementById("SettingsBox").style.visibility = visibility;
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

// function LeftSide(props) {
//     return (
//         <React.Fragment>
//             <div className="leftSideContainer" >
//                 <div className="leftSideSettingsIcon" onClick={this.onSettingsButtonClick}>
//                 <p>⚙️</p>
//                 </div>
//                 <div style={{height:"5%"}}><h1 align='center' style={{backgroundColor:'#ffc933', fontWeight:'bold'}}>Nerdchat App</h1></div>
//                 <LeftSideTitle />
//                 <div className="latestMessagesContainer" style={{height:"90%"}}>
//                 <ChatContext.Consumer>
//                     {({chatRoomList, setActiveChatId}) => {
//                         console.log(chatRoomList);
//                         return <LeftSideLatest {...{chatRoomList, setActiveChatId}}/>
//                     }}
                
                    
                
//                 </ChatContext.Consumer>
//                 </div>
//             </div>
//         </React.Fragment>
//     )
    
// }
export default LeftSide;