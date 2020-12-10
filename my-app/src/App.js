import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import Chat from "./Chat";
import LoginWindow from "./loginWindow/loginWindow";
import RegistrationWindow from "./loginWindow/registrationWindow/registrationWindow";
import { getChatRoomList } from "./common/Api";
import { configSetDefault, configImport } from "./common/config";
import { UserConfig, UserContext } from "./context";

const App = () => {
  const [config, setConfig] = useState(undefined);
  const [myUserId, setMyUserId] = useState();
  const getDefaultConfig = () => {
    return {
      // text
      fontSizeMultiplier: 1,
      textColorMain: "#1f1f2e", // 1f1f2e - 696969
      textColorUser: "#f5f5f5", //f5f5f5
      // background colors
      colorAccents: "#6f9", // 66ff99 - ffc933  - ff99cc
      colorBackground: "#333", // 333333
      // time
      twelweHourFormating: false,
    };
  };
  useEffect(() => {
    setConfig(getDefaultConfig());
  }, []);
  if (config === undefined) {
    setConfig(getDefaultConfig());
  }
  useEffect(() => {}, [myUserId]);
  return (
    <UserConfig.Provider value={config}>
      <UserContext.Provider value={{ myUserId, setMyUserId }}>
        <div>
          <LoginWindow setMyUserId={setMyUserId} />
          <RegistrationWindow />
          <Chat {...{ myUserId, setConfig }} />
        </div>
      </UserContext.Provider>
    </UserConfig.Provider>
  );
};

export default App;
