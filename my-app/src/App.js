import "./App.css";
import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import LoginWindow from "./loginWindow/loginWindow";
import RegistrationWindow from "./loginWindow/registrationWindow/registrationWindow";
import { getChatRoomList, HttpApi } from "./common/Api";
import { configSetDefault, configImport } from "./common/config";
import { UserConfig, UserContext } from "./context";
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
    currentStatus: "online",
  };
};

export const windowType = { login: 1, register: 2, chat: 3 };

const App = () => {
  const [config, setConfig] = useState(getDefaultConfig());
  const [creds, setCreds] = useState({
    userId: null,
    token: null,
    nickname: null,
  });
  const [openWindow, setOpenWindow] = useState(windowType.login);
  const [api, setApi] = useState(
    new HttpApi(Object.assign({}, creds), setCreds)
  );

  Notification.requestPermission();
  return (
    <UserConfig.Provider value={config}>
      <UserContext.Provider value={{ api, creds }}>
        <div>
          {openWindow === windowType.login ? (
            <LoginWindow {...{ api, setOpenWindow }} />
          ) : openWindow === windowType.register ? (
            <RegistrationWindow {...{ api, setOpenWindow }} />
          ) : null}
          <div className={openWindow === windowType.chat ? "" : "hidden"}>
            <Chat
              {...{
                api,
                setOpenWindow,
                creds,
                setConfig,
                myUserId: creds.userId,
              }}
            />
          </div>
        </div>
      </UserContext.Provider>
    </UserConfig.Provider>
  );
};

export default App;
