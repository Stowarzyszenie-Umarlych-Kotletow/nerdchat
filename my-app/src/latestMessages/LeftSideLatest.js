import LatestMessage from './latestMessage';
import './LeftSideLatest.css';
import AddMessage from '../messageBoard/AddMessage';
import {getChatRoomList} from '../common/Api'
import {ChatContext} from '../App'
import { useEffect } from 'react';
import {configGet} from '../common/config'


function wrapText(text) {
    if(text.length > 25){
        let temp = text.substring(0, 25);
        return temp + "...";
    }
    return text;
}

function LeftSideLatest({chatRoomList, setActiveChatId, myUserId}) {
    var pepe = 10;

    return chatRoomList === undefined ? null : chatRoomList.map(m => {
        return (
            <div className="latestMessage" key={m.chatName} style={{backgroundColor: configGet('colorAccents'), color: configGet('textColorMain'), 
            fontSize: String(16 * configGet('fontSizeMultiplier')) + "px"}} onClick={(e) => {
                setActiveChatId(m.lastMessage.chatRoomId); 
                document.getElementById('chatName').setAttribute('dataText', m.chatName);
                }}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <div className="latestMessageName" style={{fontSize: String(22 * configGet('fontSizeMultiplier')) + "px"}}>{m.chatName}</div>
                    <div className="unreadMessagesCount">{pepe}</div>
                </div>
                <div className="latestMessageDate" >{new Date(Date.parse(m.lastMessage.sentAt)).toDateString()}</div>
                <div className="latestMessageMessage" >{wrapText(m.lastMessage.contentPreview)}</div>  
            </div>
        );
    });
}

export default LeftSideLatest;