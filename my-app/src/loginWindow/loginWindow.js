import React, { Component } from "react";
import "./loginWindow.css";
import { ChatContext, UserContext } from "../context";
import { windowType } from "../App";

export class LoginWindow extends Component {
  state = {
    login: "",
    password: "",
  };
  onLogin = (e) => {
    e.preventDefault();
    this.context.api.createToken(this.state.login, this.state.password).then(
      (id) => {
        this.props.setOpenWindow(windowType.chat);
      },
      (m) => window.alert(`Login failed (${m.message})`)
    );
  };

  onRegister = () => {
    this.props.setOpenWindow(windowType.register);
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onForgotPassword = () => {
    // TODO: 'forgotten password handling'
    console.log("forgot my password, send help");
    window.alert('Please contact the administrator');
  };

  render() {
    return (
      <form  
      id="loginWindow" 
      onSubmit={(e) => this.onLogin(e)}>
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
          <a onClick={this.onForgotPassword} href="google.com">
            I forgot my password
          </a>
        </small>
        <div>
          <input
            type="submit"
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
