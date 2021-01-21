import { Component } from "react";
import "./FileBox.css";

class FileBox extends Component {
//   state = {
//     file: "",
//   };

  onFileButtonClicked = (e) => {
    var file = e.target.files[0];
    //console.log(this.state.file);
    var reader = new FileReader();
    reader.onload = function (w) {
        console.log(w.target.result);
    };
    if (file) {
      reader.readas(file);
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
            fontSize: "20px",
            backgroundColor: "#262626",
            border: "none",
          }}
          onChange={this.onFileButtonClicked}
        />
      </div>
    );
  }
}

export default FileBox;
