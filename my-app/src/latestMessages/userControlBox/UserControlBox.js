import React, { Component } from "react";
import "./UserControlBox.css";
import { UserConfig } from "../../context";
import { UserContext } from "../../context";

var statusDisplayName = {
  online: "🔔",
  busy: "🔕",
};

export class UserControlBox extends Component {
  onSettingsButtonClick = () => {
    document.getElementById("EmojiBox").style.visibility = "hidden";
    //document.getElementById("SettingsBox").style.visibility = "visible";
    this.props.setSettingsOpen(true);
  };

  state = {
    currentStatus: "online",
    status: {
      online: "chartreuse",
      afk: "yellow",
      busy: "red",
    },
  };

  getColorFromStatus = () => {
    return this.state.status[this.state.currentStatus];
  };

  onStatusClick = () => {
    if (this.state.currentStatus === "online") {
      this.setState({ currentStatus: "busy" });
    } else {
      this.setState({ currentStatus: "online" });
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
        }}
      >
        <div id="userInfo">
          <UserContext.Consumer>
            {({ myUserName }) => <div id="userName" dataText={myUserName} />}
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
