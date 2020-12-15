import React, { Component } from "react";
import "./loginWindow.css";
import { logIn } from "../common/Api";

export class LoginWindow extends Component {
  state = {
    login: "",
    password: "",
  };
  onLogin = () => {
    logIn(this.state.login, this.state.password).then(
      (id) => {
        this.props.setMyUserId(id);
        this.props.setMyUserName(this.state.login);
        document.getElementById("loginWindow").style.visibility = "hidden";
        document.getElementById("MainContent").style.visibility = "visible";
      },
      (err) => window.alert("Login failed")
    );
  };

  onRegister = () => {
    //document.getElementById("loginWindow").style.visibility = 'hidden';
    document.getElementById("registrationWindow").style.visibility = "visible";
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onForgotPassword = () => {
    // TODO: 'forgotten password handling'
    console.log("forgot my password, send help");
  };

  render() {
    return (
      <div id="loginWindow">
        Hello, please sign in!
        <input
          id="loginField"
          type="text"
          name="login"
          placeholder="Login..."
          onChange={this.onChange}
        />
        <input
          id="passwordField"
          type="password"
          name="password"
          placeholder="Password..."
          onChange={this.onChange}
        />
        <small>
          <a onClick={this.onForgotPassword}>I forgot my password</a>
        </small>
        <div>
          <input
            type="button"
            value="Log in"
            id="loginButton"
            onClick={this.onLogin}
          />
          <input
            type="button"
            value="Register"
            id="registerButton"
            onClick={this.onRegister}
          />
        </div>
      </div>
    );
  }
}

export default LoginWindow;
