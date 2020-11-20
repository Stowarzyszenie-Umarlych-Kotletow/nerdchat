import React, { Component } from 'react'
import './loginWindow.css'
import {logIn} from '../common/Api'

export class LoginWindow extends Component {

    state = {
        login: '',
        password: ''
    }
    onLogin = () => {
        logIn(this.state.login, this.setState.password).then(id => {
            this.props.setMyUserId(id);
            document.getElementById("loginWindow").style.visibility = 'hidden';
            document.getElementById("MainContent").style.visibility =  'visible';
        }, err => window.alert('Login failed'));
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});


    render() {
        return (
            <div id="loginWindow">
                Hello, please sign in!
                <input 
                 id = "loginField"
                 type="text" 
                 name="login" 
                 placeholder="Login..."
                 onChange={this.onChange} 
                 />
                <input 
                 id = "passwordField"
                 type="password" 
                 name="password" 
                 placeholder="Password..."
                 onChange={this.onChange} 
                 />
                 <input 
                type="button"
                value="Log in"
                id="loginButton"
                onClick={this.onLogin}
                />
                 
            </div>
        )
    }
}

export default LoginWindow
