import React, { Component } from 'react'
import './SettingsBox.css'

class SettingsBox extends Component {
    render() {
        return (
            <div id="SettingsBox">
                <div id="SettingsBoxHeaderContainer">
                    <div id="SettingsBoxHeader"> Settings</div>
                    <div className="XButton" onClick={() => {document.getElementById("SettingsBox").style.visibility = "hidden";}}></div>
                </div>
                <div id="SettingsContainer">
                    <div>SETTING 1</div>
                </div>
            </div>
        )
    }
}

export default SettingsBox;