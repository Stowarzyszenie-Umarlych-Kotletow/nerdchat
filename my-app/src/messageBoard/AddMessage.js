import React, { Component } from "react";

export class AddMessage extends Component {
  state = {
    content: "",
  };

  // function that submits a message
  onSubmit = (e) => {
    // overwriting onSubmit fuction
    e.preventDefault();
    // calling function that adds a message
    this.props.addMessage(document.getElementById("textField").value);
    // reseting input field
    this.setState({ content: "" });
    // keeping a focus on input field to allow continious writing
    document.getElementById("textField").focus();
  };

  // function that handles changes in input field value
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // rendering two input elements, one text field and second a submit button
  render() {
    return (
      <form
        onSubmit={this.onSubmit}
        style={{ display: "flex" }}
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
          style={{
            flex: "1",
            fontSize: "20px",
            backgroundColor: "#262626",
            border: "none",
          }}
          onClick={this.props.switchOpenEmoji}
        />
        <input
          type="button"
          value="📎"
          id="FileButton"
          style={{
            flex: "1",
            fontSize: "20px",
            backgroundColor: "#262626",
            border: "none",
          }}
          onClick={this.props.switchOpenFile}
        />
        {/* <input
          type="file"
          //value="📎"
          accept=".txt"
          id="file-input"
          style={{
            flex: "1",
            fontSize: "20px",
            backgroundColor: "#262626",
            border: "none",
          }}
          onChange={this.onFileButtonClicked}
        /> */}
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
