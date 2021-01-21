import { Component } from "react";
import { UserConfig } from "../context";
import "./FileBox.css";

class FileBox extends Component {

  static contextType = UserConfig;
  onFileButtonClicked = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (w) {
        console.log(w.target.result);
    };
    if (file) {
      console.log(file.name);
      reader.readAsBinaryString(file);
      document.getElementById("size-label").innerHTML = (file.size/1024).toFixed(2) + "KB";
    }else{
      document.getElementById("size-label").innerHTML = "";
    }
  };

  render() {
    return (
      <div id="FileBox">
        <input
          type="file"
          accept=".txt"
          id="file-input"
          style={{
            flex: "1",
            fontSize: "24px",
            // backgroundColor: "#444c",
            border: "none",
            padding: "5px",
            height: "95%",
            width: "100%",
          }}
          onChange={this.onFileButtonClicked}
        />
        <label id="size-label"></label>
      </div>
    );
  }
}

export default FileBox;
