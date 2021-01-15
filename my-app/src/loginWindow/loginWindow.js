import React, { Component } from "react";
import "./loginWindow.css";
import { ChatContext, UserContext } from "../context";

export class LoginWindow extends Component {
  state = {
    login: "",
    password: "",
  };
  onLogin = () => {
    this.context.api.createToken(this.state.login, this.state.password).then(
      (id) => {
        document.getElementById("loginWindow").style.visibility = "hidden";
        document.getElementById("MainContent").style.visibility = "visible";
      },
      () => window.alert("Login failed")
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
      <form id="loginWindow">
        Hello, please sign in!
        <input
          id="loginField"
          type="text"
          name="login"
          placeholder="Login..."
          onChange={this.onChange}
        />
        <input
          className="passwordField"
          type="password"
          name="password"
          placeholder="Password..."
          onChange={this.onChange}
        />
        <small>
          <a onClick={this.onForgotPassword} href="google.com">I forgot my password</a>
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
            id="registerToggleButton"
            onClick={this.onRegister}
          />
        </div>
      </form>
    );
  }
}

LoginWindow.contextType = UserContext;

export default LoginWindow;
