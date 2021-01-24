import "./App.css";
import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import LoginWindow from "./loginWindow/loginWindow";
import RegistrationWindow from "./loginWindow/registrationWindow/registrationWindow";
import { HttpApi } from "./common/Api";
import { UserConfig, UserContext } from "./context";
export const getDefaultConfig = () => {
  return {
    // text
    fontSizeMultiplier: 1,
    textColorMain: "#1f1f2e", // 1f1f2e - 696969
    textColorUser: "#f5f5f5", //f5f5f5
    // background colors
    accentsColor: "#6f9", // 66ff99 - ffc933  - ff99cc
    backgroundColor: "#333", // 333333
    // time
    twelweHourFormating: false,
    currentStatus: "online",
  };
};

export const windowType = { login: 1, register: 2, chat: 3 };

const App = () => {
  const [config, setConfig] = useState(getDefaultConfig());
  const [creds, setCreds] = useState({
    token: null,
    nickname: null,
  });
  const [openWindow, setOpenWindow] = useState(windowType.login);
  const [api] = useState(new HttpApi(Object.assign({}, creds), setCreds));

  useEffect(() => {
    if (window.localStorage) {
      let token = window.localStorage.getItem("token");
      let nickname = window.localStorage.getItem("nickname");
      if (token !== null && nickname !== null) {
        api.refreshToken(nickname, token).then(
          (data) => {
            api.updateCredentials(data);
          },
          () => {
            window.localStorage.clear();
          }
        );
      }
    }
  }, []);
  useEffect(() => {
    if (creds.token !== null) {
      setOpenWindow(windowType.chat);
      window.localStorage.setItem("token", creds.token);
      window.localStorage.setItem("nickname", creds.nickname);
    } else {
      setOpenWindow(windowType.login);
      window.localStorage.clear();
    }
  }, [creds]);

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
                config,
                setConfig,
                myNick: creds.nickname,
              }}
            />
          </div>
        </div>
      </UserContext.Provider>
    </UserConfig.Provider>
  );
};

export default App;
