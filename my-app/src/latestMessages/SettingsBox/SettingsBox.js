import React, { Component } from 'react'
import Slider, {createSliderWithTooltip} from 'rc-slider'
import "rc-slider/assets/index.css";
import 'react-dropdown/style.css';
import './SettingsBox.css'



class SettingsBox extends Component {

    state = {
        fontSizeMultiplier: 1.0
    }

    saveSettings = () => {
        // TODO: save settings to config and config to database
        document.getElementById("SettingsBox").style.visibility = 'hidden';
        let pColor = document.getElementById("primaryColorPicker").value;
        let aColor = document.getElementById("accentColorPicker").value;
        let pfColor = document.getElementById("primaryFontColorPicker").value;
        let sfColor = document.getElementById("secondaryFontColorPicker").value;
        let fontSizeMultiplier = 0;
        if(this.state.fontSizeMultiplier == null){
            fontSizeMultiplier = 1.0;
        }else{
            fontSizeMultiplier = this.state.fontSizeMultiplier;
        }
        console.log(fontSizeMultiplier);
        console.log(pColor, aColor, pfColor, sfColor);
        // saving colors to config and updating them in the app
    }

    onFontSizeChanged = (e) => {
        if(e == null){
            e = 1.0;
        }
        this.setState({"fontSizeMultiplier": e});
        console.log(e);
        return;
    }

    onLoad = () => {
        //loads fontSizeMultiplier and colors from config
    }


    render() {
        let marks = {
            0.7: "0.7x", 
            0.8: "0.8x", 
            0.9: "0.9x", 
            1.0: "1.0x", 
            1.1: "1.1x", 
            1.2: "1.2x", 
            1.3: "1.3x", 
            1.4: "1.4x"
        }
        
        // let primaryColorPicker = document.querySelector("primaryColorPicker");
        // primaryColorPicker.value = "#ffffff";
        // primaryColorPicker.addEventListener("change", this.onPrimaryColorSelect, false);
        const SliderWithTooltip = createSliderWithTooltip(Slider);
        return (
            <div id="SettingsBox">
                <div id="SettingsBoxHeaderContainer">
                    <div id="SettingsBoxHeader"> Settings</div>
                    <div className="XButtonSettings" onClick={() => {document.getElementById("SettingsBox").style.visibility = "hidden";}}></div>
                </div>
                <div id="SettingsContainer">
                    <div id="SettingElement">
                        <label>Font size</label><br/>
                        <SliderWithTooltip 
                            defaultValue={1.0}
                            value={this.state.fontSizeMultiplier}
                            min={0.7}
                            max={1.4}
                            step={0.1}
                            dots={true}
                            marks={marks}
                            onChange={this.onFontSizeChanged}
                        />
                    </div>
                    <div id="SettingElement">
                        <div id="colorPicker1">
                            <label>Primary Color</label><br />
                            <input id="primaryColorPicker" type="color" onChange={this.onPrimaryColorSelect}></input>
                        </div>
                        <div id="colorPicker2">
                            <label>Accent color</label><br />
                            <input id="accentColorPicker" type="color" onChange={this.onSecondaryColorSelect}></input>
                        </div>
                    </div>
                    <div id="SettingElement">
                        <div id="colorPicker1">
                            <label>Primary Font Color</label><br />
                            <input id="primaryFontColorPicker" type="color" onChange={this.onPrimaryFontColorSelect}></input>
                        </div>
                        <div id="colorPicker2">
                            <label>Secondary Font color</label><br />
                            <input id="secondaryFontColorPicker" type="color" onChange={this.onSecondaryFontColorSelect}></input>
                        </div>
                    </div>
                </div>
                <div id="SettingsSave">
                    <input type="button" value="Save changes" id="saveSettingsButton" onClick={this.saveSettings}></input>
                </div>
            </div>
        )
    }
}

export default SettingsBox;