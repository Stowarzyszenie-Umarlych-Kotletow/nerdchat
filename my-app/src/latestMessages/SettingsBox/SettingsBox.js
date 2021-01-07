import React, { Component, useContext, useState, useEffect } from "react";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import "react-dropdown/style.css";
import "./SettingsBox.css";
import { configUpdate } from "../../common/config";
import { UserConfig } from "../../context";
import InputColor from "react-input-color";

const SettingsBox = ({ updateConfig, setSettingsOpen }) => {
  const config = useContext(UserConfig);
  const SliderWithTooltip = createSliderWithTooltip(Slider);
  const [localCfg, setLocalCfg] = useState({ fontSizeMultiplier: "1.0" });

  const saveSettings = () => {
    // TODO: save settings to config and config to database
    console.log(localCfg);
    //console.log(pColor, aColor, pfColor, sfColor);
    updateConfig(Object.assign({}, localCfg));
    // saving colors to config and updating them in the app
  };

  const onFontSizeChanged = (e) => {
    if (e == null) {
      e = 1.0;
    }
    setLocalCfg(Object.assign({}, localCfg, { fontSizeMultiplier: e }));
    return;
  };

  const onColorChanged = (name, color) => {
    setLocalCfg(Object.assign({}, localCfg, { [name]: color }));
  };

  useEffect(() => {
    setLocalCfg(Object.assign({}, config));
  }, []);

  const onLoad = () => {
    //loads fontSizeMultiplier and colors from config
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
            setSettingsOpen(false);
          }}
        ></div>
      </div>
      <div id="SettingsContainer">
        <div id="SettingElement">
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
        <div id="SettingElement">
          <div id="colorPicker1">
            <label>Primary Color</label>
            <br />
            <InputColor
              initialValue={config.colorBackground}
              onChange={(c) => onColorChanged("colorBackground", c.hex)}
              placement="right"
            />
          </div>
          <div id="colorPicker2">
            <label>Accent color</label>
            <br />
            <InputColor
              initialValue={config.colorAccents}
              onChange={(c) => onColorChanged("colorAccents", c.hex)}
              placement="right"
            />
            {/*<input id="accentColorPicker" type="color"></input>*/}
          </div>
        </div>
        <div id="SettingElement">
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
      </div>
      <div id="SettingsSave">
        <input
          type="button"
          value="Save changes"
          id="saveSettingsButton"
          onClick={saveSettings}
        ></input>
      </div>
    </div>
  );
};

export default SettingsBox;
