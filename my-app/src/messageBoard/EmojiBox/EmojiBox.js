import React, { Component } from "react";
import "./EmojiBox.css";
import Emojis from "./Emojis";
import { ChatContext } from "../../context";
import { dragElement } from "../../common/utils"

export class EmojiBox extends Component {
  render() {
    return (
      <div id="EmojiBox">
        <div id="EmojiBoxHeaderContainer">
          <div id="EmojiBoxHeader"> Emoji Box</div>
          <div className="XButton" onClick={this.props.switchOpenEmoji} />
        </div>
        <div id="EmojiContainer">
          <Emojis emojis={this.context.emojis} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    dragElement(document.getElementById("EmojiBox"));
  }

}

EmojiBox.contextType = ChatContext;
export default EmojiBox;