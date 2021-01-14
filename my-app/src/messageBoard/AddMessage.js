import React, { Component } from "react";

export class AddMessage extends Component {
  state = {
    content: "",
    visibility: true
  };

  // function that submits a message
  onSubmit = (e) => {
    // overwriting onSubmit fuction
    e.preventDefault();
    // time of sending
    const date = new Date();
    const minutes =
      date.getMinutes() < 10 ? ":0" + date.getMinutes() : date.getMinutes();
    const time = String() + date.getHours() + ":" + minutes;
    // calling function that adds a message
    this.props.addMessage(
      document.getElementById("textField").value,
      "Me",
      time
    );
    // reseting input field
    this.setState({ content: "" });
    // keeping a focus on input field to allow continious writing
    document.getElementById("textField").focus();
  };

  // function that handles changes in input field value
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // opening or closing emoji window
  onEmojiButtonClick = () => {
    var visibility = document.getElementById("EmojiBox").style.visibility;
    if (visibility === "visible") visibility = "hidden";
    else visibility = "visible";
    document.getElementById("EmojiBox").style.visibility = visibility;
  };

  // rendering two input elements, one text field and second a submit button
  render() {
    return (
      <form
        onSubmit={this.onSubmit}
        style={{ display: "flex"}}
        autoComplete="off"
      >
        <input
          type="hidden"
          autoComplete="false"
          style={{ width: "0px", height: "0px" }}
        />
        <input
          type="button"
          value="😈"
          id="EmojiButton"
          autoComplete="off"
          autoCorrect="off"
          style={{
            flex: "1",
            fontSize: "20px",
            backgroundColor: "#262626",
            border: "none",
          }}
          onClick={this.onEmojiButtonClick}
        />
        <input
          id="textField"
          type="text"
          name="content"
          style={{ flex: "30", padding: "5px", height: "40px" }}
          placeholder="Write a message..."
          value={this.state.content}
          onChange={this.onChange}
        />
        <input
          type="submit"
          value="Send"
          className="btn"
          style={{ flex: "3", fontSize: "20px", fontWeight: "300" }}
        />
      </form>
    );
  }
}

export default AddMessage;
