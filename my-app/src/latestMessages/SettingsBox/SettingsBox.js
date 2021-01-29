import React, { useContext, useState, useEffect } from "react";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import "react-dropdown/style.css";
import "./SettingsBox.css";
import { UserConfig, UserContext } from "../../context";
import { getDefaultConfig } from "../../App";
import InputColor from "react-input-color";

const SettingsBox = ({ updateConfig, setSettingsOpen }) => {
  const config = useContext(UserConfig);
  const user = useContext(UserContext);
  const SliderWithTooltip = createSliderWithTooltip(Slider);
  const [localCfg, setLocalCfg] = useState({ fontSizeMultiplier: "1.0" });

  const saveSettings = () => {
    updateConfig(Object.assign({}, localCfg));
  };

  const resetSettings = () => {
    updateConfig(getDefaultConfig());
  };

  const logoutUser = () => {
    // logout user
    user.api.logout();
    window.location.reload();
  };

  const onFontSizeChanged = (e) => {
    if (e == null) {
      e = 1.0;
    }
    setLocalCfg(Object.assign({}, localCfg, { fontSizeMultiplier: e }));
  };

  const onColorChanged = (name, color) => {
    setLocalCfg(Object.assign({}, localCfg, { [name]: color }));
  };

  useEffect(() => {
    setLocalCfg(Object.assign({}, config));
  }, []);

  // change profile pic
  const changeProfilePic = (pic_id) => {
    setLocalCfg(Object.assign({}, localCfg, { avatarId: pic_id }));
  };

  let marks = {
    0.7: "70%",
    0.8: "80%",
    0.9: "90%",
    1.0: "100%",
    1.1: "110%",
    1.2: "120%",
    1.3: "130%",
    1.4: "140%",
  };

  return (
    <div id="SettingsBox">
      <div id="SettingsBoxHeaderContainer">
        <div id="SettingsBoxHeader"> Settings</div>
        <div
          className="XButtonSettings"
          onClick={() => {
            setSettingsOpen();
          }}
        ></div>
      </div>
      <div id="SettingsContainer">
        <div className="SettingElement">
          <label>Font size</label>
          <br />
          <SliderWithTooltip
            defaultValue={config.fontSizeMultiplier}
            value={localCfg.fontSizeMultiplier}
            min={0.7}
            max={1.4}
            step={0.1}
            dots={true}
            marks={marks}
            onChange={onFontSizeChanged}
          />
        </div>
        <div className="SettingElement">
          <div id="colorPicker1">
            <label>Primary Color</label>
            <br />
            <InputColor
              initialValue={config.backgroundColor}
              onChange={(c) => onColorChanged("backgroundColor", c.hex)}
              placement="right"
            />
          </div>
          <div id="colorPicker2">
            <label>Accent color</label>
            <br />
            <InputColor
              initialValue={config.accentsColor}
              onChange={(c) => onColorChanged("accentsColor", c.hex)}
              placement="right"
            />
          </div>
        </div>
        <div className="SettingElement">
          <div id="colorPicker1">
            <label>Primary Font Color</label>
            <br />
            <InputColor
              initialValue={config.textColorMain}
              onChange={(c) => onColorChanged("textColorMain", c.hex)}
              placement="right"
            />
          </div>
          <div id="colorPicker2">
            <label>Secondary Font color</label>
            <br />
            <InputColor
              initialValue={config.textColorUser}
              onChange={(c) => onColorChanged("textColorUser", c.hex)}
              placement="right"
            />
          </div>
        </div>

        <div id="SettingsProfilePictures">
          <br />
          <br />
          <label>Profile pictures</label>
          <br />
          {(() => {
            let arr = [];
            for (let i = 1; i <= 9; i++) {
              arr.push(
                <img
                  src={`/assets/NerdchatDefPic${i}.png`}
                  alt=""
                  style={{
                    height: "100px",
                    width: "100px",
                    marginRight: "10px",
                  }}
                  onClick={() => changeProfilePic(i)}
                />
              );
            }
            return arr;
          })()}
        </div>
      </div>
      <div
        style={{
          height: "10%",
          minHeight: "40px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          padding: "10px",
        }}
      >
        <input
          type="button"
          value="Save changes"
          id="saveSettingsButton"
          onClick={saveSettings}
        />
        <input
          type="button"
          value="Reset Settings"
          id="resetSettingsButton"
          onClick={resetSettings}
        />

        <input
          type="button"
          value="Logout"
          id="logoutButton"
          onClick={logoutUser}
        />
      </div>
    </div>
  );
};

export default SettingsBox;
