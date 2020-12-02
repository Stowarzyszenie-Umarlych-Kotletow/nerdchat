import React, { Component } from 'react'
import Slider, {createSliderWithTooltip} from 'rc-slider'
import "rc-slider/assets/index.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './SettingsBox.css'

class SettingsBox extends Component {

    saveSettings = () => {
        // TODO: save settings to config and config to database
        document.getElementById("SettingsBox").style.visibility = 'hidden';
    }

    onPrimaryColorSelect = (e) => {
        this.props.primaryColor = e.value;
    }

    render() {
        let marks = {}
        for(let i = 10; i <= 20; i++){
            marks[i] = String(i + 'px');
        }
        const primaryColorOptions = [
            'White', 'Black', 'Grey'
        ]
        const defaultPCOption = primaryColorOptions[2];
        const secondaryColorOptions = [
            'Yellow', 'Blue', 'Green', 'Purple'
        ]
        const defaultSCOption = secondaryColorOptions[0];
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
                            defaultValue={13}
                            min={10}
                            max={20}
                            marks={marks}
                            onAfterChange={value => this.props.fontSize}
                        />
                    </div>
                    <div id="SettingElement">
                        <div id="colorPicker1">
                            <label>Primary Color</label><br />
                            <Dropdown 
                                options={primaryColorOptions}
                                value={defaultPCOption}
                                placeholder="Select an option"
                                onChange={this.onPrimaryColorSelect}
                            />
                        </div>
                        <div id="colorPicker2">
                            <label>Secondary Color</label><br />
                            <Dropdown 
                                options={secondaryColorOptions}
                                value={defaultSCOption}
                                placeholder="Select an option"
                                onChange={this.onPrimaryColorSelect}
                            />
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