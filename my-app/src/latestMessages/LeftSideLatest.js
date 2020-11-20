import LatestMessage from './latestMessage';
import './LeftSideLatest.css';
import AddMessage from '../messageBoard/AddMessage';
import {getChatRoomList} from '../common/Api'
import {ChatContext} from '../App'
import { useEffect } from 'react';


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
            <div id="latestMessage" key={m.chatName} onClick={(e) => setActiveChatId(m.lastMessage.chatRoomId)}>
            <div id="latestMessageName">{m.chatName}</div>
            <div id="latestMessageDate">{new Date(Date.parse(m.lastMessage.sentAt)).toDateString()}</div>
            <div id="latestMessageMessage">{wrapText(m.lastMessage.contentPreview)}</div>  
            </div>
        );
    });
}

export default LeftSideLatest;