import React, { Component } from 'react'
import './UserControlBox.css'

export class UserControlBox extends Component {

    onSettingsButtonClick = () => {
        document.getElementById("EmojiBox").style.visibility = 'hidden';
        document.getElementById("SettingsBox").style.visibility = 'visible';
    }

    currentStatus = 'online';
    statuses = {
        'online' : 'chartreuse',
        'afk' : 'yellow',
        'busy' : 'red'

    }
  
    onStatusClick = () => {
        var statusElement = document.getElementById('userStatus');
        if (this.currentStatus === 'online') {
            statusElement.style.backgroundColor = 'red';
            this.currentStatus = 'busy';
        }
        else {
            statusElement.style.backgroundColor = 'chartreuse';
            this.currentStatus = 'online';
        }
    } 

    render() {
        return (
            <div id='userControlBox'>
                <div id="userInfo"> 
                    <div id='userName' dataText="ControlUser#1337"/>
                    <div id="userStatus" onClick={this.onStatusClick}/> 
                </div>
                <div id="settingsIcon" onClick={this.onSettingsButtonClick}>⚙️</div>
            </div>
        )
    }
}

export default UserControlBox
