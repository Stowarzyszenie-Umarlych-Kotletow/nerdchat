import LatestMessage from './latestMessage';
import './LeftSideLatest.css';
import AddMessage from '../messageBoard/AddMessage';
import {getChatRoomList} from '../common/Api'
import {ChatContext} from '../App'
import { useEffect } from 'react';
import {lsgi} from '../common/Api'


function wrapText(text) {
    if(text.length > 25){
        let temp = text.substring(0, 25);
        return temp + "...";
    }
    return text;
}

function LeftSideLatest({chatRoomList, setActiveChatId, myUserId}) {

    return chatRoomList === undefined ? null : chatRoomList.map(m => {
        return (
            <div className="latestMessage" key={m.chatName} style={{backgroundColor: lsgi('colorAccents'), color: lsgi('textColorMain'), 
            fontSize: String(16 * lsgi('fontSizeMultiplier')) + "px"}} onClick={(e) => {
                setActiveChatId(m.lastMessage.chatRoomId); 
                // change chat name
                document.getElementById('chatName').setAttribute('dataText', m.chatName);
                }}>
                <div className="latestMessageName" style={{fontSize: String(22 * lsgi('fontSizeMultiplier')) + "px"}}>{m.chatName}</div>
                <div className="latestMessageDate" >{new Date(Date.parse(m.lastMessage.sentAt)).toDateString()}</div>
                <div className="latestMessageMessage" >{wrapText(m.lastMessage.contentPreview)}</div>  
            </div>
        );
    });
}

export default LeftSideLatest;