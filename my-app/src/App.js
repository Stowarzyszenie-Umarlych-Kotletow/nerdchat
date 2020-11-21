import './App.css';
import React, {useState, useEffect, useContext} from 'react';
import Chat from './Chat';
import LeftSide from './latestMessages/LeftSideContent';
import MessagesContent from './latestMessages/MessagesContent';
import LoginWindow from './loginWindow/loginWindow'
import {getChatRoomList} from './common/Api'

export const ChatContext = React.createContext();

const App = () => {
  const [myUserId, setMyUserId] = useState();
  const [activeChatId, setActiveChatId] = useState();
  const [chatRoomList, setChatRoomList] = useState([]);
  const [wsClient, setWsClient] = useState(undefined);


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
  if(wsClient === undefined) {

  }
  getChatRoomList(myUserId).then(rooms => setChatRoomList(rooms));
}, myUserId);

  return (
    <ChatContext.Provider value={{myUserId, setMyUserId, activeChatId, setActiveChatId, chatRoomList, setChatRoomList}}>
      
      {/* <h1 align='center' style={{backgroundColor:'#ffc933', fontWeight:'bold'}}>Nerdchat App</h1> */}
      <div>
            <LoginWindow setMyUserId={setMyUserId} />
            <Chat/>
      </div>
    </ChatContext.Provider>
  );
}



export default App; 

