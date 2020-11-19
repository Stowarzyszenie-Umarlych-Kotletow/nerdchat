import React, { Component } from 'react'
import './loginWindow.css'

export class LoginWindow extends Component {

    onLogin = () => {
        document.getElementById("loginWindow").style.visibility = 'hidden';
        document.getElementById("MainContent").style.visibility =  'visible';
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});


    render() {
        return (
            <div id="loginWindow">
                Hello, please sign in!
                <input 
                 id = "loginField"
                 type="text" 
                 name="content" 
                 placeholder="Login..."
                 onChange={this.onChange} 
                 />
                <input 
                 id = "passwordField"
                 type="password" 
                 name="content" 
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
