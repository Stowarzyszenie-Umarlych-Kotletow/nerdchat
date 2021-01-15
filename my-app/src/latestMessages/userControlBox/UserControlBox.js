import React, { Component } from "react";
import "./UserControlBox.css";
import { UserConfig } from "../../context";
import { UserContext } from "../../context";

var statusDisplayName = {
  online: "🔔",
  busy: "🔕",
};

export class UserControlBox extends Component {
  static contextType = UserConfig;

  onSettingsButtonClick = () => {
    this.props.setSettingsOpen(!this.props.settingsOpen);
  };

  state = {
    currentStatus: "online",
    status: {
      online: "chartreuse",
      afk: "yellow",
      busy: "red",
    },
    profilePicIndex: 8,
  };

  getCurrentState = () => {
    return this.state.currentStatus;
  };

  getColorFromStatus = () => {
    return this.state.status[this.state.currentStatus];
  };

  onStatusClick = () => {
    const config = this.context;
    if (this.state.currentStatus === "online") {
      this.setState({ currentStatus: "busy" });
      config.currentStatus = "busy";
    } else {
      this.setState({ currentStatus: "online" });
      config.currentStatus = "online";
    }
  };

  render() {
    return (
      <div
        id="userControlBox"
        style={{
          backgroundColor: this.context.colorAccents,
          color: this.context.textColorMain,
          fontSize: String(24 * this.context.fontSizeMultiplier) + "px",
          paddingTop: "5px",
        }}
      >
        <img
          id="userProfilePic"
          src={`/assets/NerdchatDefPic${this.state.profilePicIndex}.png`}
          alt={""}
        />
        <div id="userInfo">
          <UserContext.Consumer>
            {({ creds }) => <div id="userName" datatext={creds.nickname} />}
          </UserContext.Consumer>

          <div
            id="userStatus"
            onClick={this.onStatusClick}
            data-text={statusDisplayName[this.state.currentStatus]}
            style={{
              backgroundColor: this.getColorFromStatus(),
              fontSize: "21px",
              cursor: "pointer",
            }}
          />
        </div>
        <div id="settingsIcon" onClick={this.onSettingsButtonClick}>
          ⚙️
        </div>
      </div>
    );
  }
}

UserControlBox.contextType = UserConfig;

export default UserControlBox;
