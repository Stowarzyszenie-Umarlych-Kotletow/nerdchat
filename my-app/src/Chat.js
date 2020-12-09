import "./Chat.css";
import React, {useState, useEffect, useContext} from 'react';
import MessagesContent from "./latestMessages/MessagesContent";
import LeftSide from "./latestMessages/LeftSideContent";
import {getChatRoomList} from './common/Api'
export const ChatContext = React.createContext();

const Chat = ({myUserId}) => {
    const [activeChatId, setActiveChatId] = useState();
    const [chatRoomList, setChatRoomList] = useState([]);

    useEffect(() => 
    {
      setInterval(() => 
      {
        if(myUserId !== undefined)
          getChatRoomList(myUserId).then(rooms => setChatRoomList(rooms));
      }, 1000);
    }, []);
  
    useEffect(() => 
    {
        getChatRoomList(myUserId).then(rooms => setChatRoomList(rooms));
    }, myUserId);

    return (
        <ChatContext.Provider value={{myUserId, activeChatId, setActiveChatId, chatRoomList, setChatRoomList}}>
            <div id="MainContent" style={{visibility: "hidden"}}>
                <MessagesContent /> 
                <LeftSide/>
            </div>
        </ChatContext.Provider>
    );
}

export default Chat;