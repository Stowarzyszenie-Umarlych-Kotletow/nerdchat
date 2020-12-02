import React, { Component } from 'react'
import './UserControlBox.css'
import {lsgi} from '../../common/Api'

export class UserControlBox extends Component {

    onSettingsButtonClick = () => {
        document.getElementById("EmojiBox").style.visibility = 'hidden';
        document.getElementById("SettingsBox").style.visibility = 'visible';
    }

    state = {
        currentStatus : 'online',
        status : {
            'online' : 'chartreuse',
            'afk' : 'yellow',
            'busy' : 'red'
        }
    }
    
    getColorFromStatus = () => {
        return this.state.status[this.state.currentStatus];
    } 

    onStatusClick = () => {
        if (this.state.currentStatus === 'online') {
            this.setState({currentStatus: 'busy'});
        }
        else {
            this.setState({currentStatus: 'online'});
        }
    } 

    render() {
        return (
            <div id='userControlBox' style={{backgroundColor:lsgi('colorAccents'), color:lsgi('textColorMain'), fontSize: String(24 * lsgi('fontSizeMultiplier')) +'px'}}>
                <div id="userInfo"> 
                    <div id='userName' dataText="ControlUser#1337"/>
                    <div id="userStatus" onClick={this.onStatusClick} style={{backgroundColor: this.getColorFromStatus()}}/> 
                </div>
                <div id="settingsIcon" onClick={this.onSettingsButtonClick}>⚙️</div>
            </div>
        )
    }
}

export default UserControlBox