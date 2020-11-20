import LatestMessage from './latestMessage';
import './LeftSideLatest.css';
import AddMessage from '../messageBoard/AddMessage';
import {getChatRoomList} from '../common/Api'
import {ChatContext} from '../App'
import { useEffect } from 'react';

function createLatestMessages(){
    let latestMessages = [];
    for(let i = 0; i < 12; i++) {
        let lMessage = new LatestMessage("John", "Hallo, how is it going in there. How is Sarah?", "2.11.2020");
        latestMessages[i] = lMessage;
    }
    return latestMessages;
}

function wrapText(text) {
    if(text.length > 25){
        let temp = text.substring(0, 25);
        return temp + "...";
    }
    return text;
}

function getAllMessages() {
    let latMessages = createLatestMessages();
    let allMessages = [];
    for(let i = 0; i < latMessages.length; i++) {
        let item;
        if(latMessages[i].message.length > 25){
            let temp = latMessages[i].message.substring(0, 25);
            latMessages[i].message = temp + "...";
        }
        item = <div id="latestMessage">
                    <div id="latestMessageName">{latMessages[i].name}</div>
                    <div id="latestMessageDate">{latMessages[i].date}</div>
                    <div id="latestMessageMessage">{latMessages[i].message}</div>  
                </div>
        allMessages.push(item);
    }
    return(allMessages)
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