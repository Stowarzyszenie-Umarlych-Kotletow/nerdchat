import "./registrationWindow.css";
import React, { Component } from "react";
import { windowType } from "../../App";

export class RegistrationWindow extends Component {
  state = {
    nickname: "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirm: "",
  };
  onRegistration = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      alert("Your password confirmation does not match.");
      return;
    }
    this.props.api
      .createAccount(
        this.state.nickname,
        this.state.firstName,
        this.state.lastName,
        this.state.password
      )
      .then(
        (success) => {
          alert("Your account was created! You can now log in.");
          this.props.setOpenWindow(windowType.login);
        },
        (err) => {
          alert(`Could not register an account\n${err.message}`);
        }
      );
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onBack = () => {
    this.props.setOpenWindow(windowType.login);
  };

  render() {
    return (
      <form id="registrationWindow">
        Welcome, join us now
        <input
          className="dataField"
          type="text"
          name="nickname"
          placeholder="Nickname..."
          onChange={this.onChange}
        />
        <input
          className="dataField"
          type="text"
          name="firstName"
          placeholder="First name..."
          onChange={this.onChange}
        />
        <input
          className="dataField"
          type="text"
          name="lastName"
          placeholder="Last name..."
          onChange={this.onChange}
        />
        <input
          className="passwordField"
          type="password"
          name="password"
          placeholder="Password..."
          onChange={this.onChange}
        />
        <input
          className="passwordField"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password..."
          onChange={this.onChange}
        />
        <input
          type="button"
          value="Register"
          id="registerButton"
          onClick={this.onRegistration}
        />
        <input
          type="button"
          value="Back"
          id="backButton"
          onClick={this.onBack}
        />
      </form>
    );
  }
}

export default RegistrationWindow;
