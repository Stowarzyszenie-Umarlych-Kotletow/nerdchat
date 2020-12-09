import './App.css';
import React, {useState, useEffect, useContext} from 'react';
import Chat from './Chat';
import LeftSide from './latestMessages/LeftSideContent';
import MessagesContent from './latestMessages/MessagesContent';
import LoginWindow from './loginWindow/loginWindow'
import RegistrationWindow from './loginWindow/registrationWindow/registrationWindow'
import {getChatRoomList} from './common/Api'
import {configSetDefault, configImport} from './common/config'

export const ChatContext = React.createContext();
export const UserContext = React.createContext();

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
  getChatRoomList(myUserId).then(rooms => setChatRoomList(rooms));
}, myUserId);

  
     return (
    <ChatContext.Provider value={{myUserId, activeChatId, setActiveChatId, chatRoomList, setChatRoomList}}>
      <UserContext.Provider value={{myUserId, setMyUserId}}>
      <div>
            <LoginWindow setMyUserId={setMyUserId} />
            <RegistrationWindow />
            <Chat/>
      </div>
      </UserContext.Provider>
    </ChatContext.Provider>
  );
}



export default App; 

