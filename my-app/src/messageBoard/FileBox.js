import { Component } from "react";
import { UserContext } from "../context";
import "./FileBox.css";

class FileBox extends Component {
  state = {
    setUploadSectionOpen: false,
    fileSize: null,
    file: undefined,
  };

  static contextType = UserContext;

  onFileButtonClicked = (e) => {
    let file = e.target.files[0];
    let fileSize = "";
    let uSectionOpen = false;
    var reader = new FileReader();
    reader.onload = function (w) {
      console.log("showing file");
    };
    if (file !== undefined) {
      uSectionOpen = true;
      fileSize = (file.size / 1024).toFixed(2) + "KB";
      console.log(this.state.setUploadSectionOpen);
      reader.readAsBinaryString(file);
    } else {
      uSectionOpen = false;
      fileSize = "";
    }
    this.setState({
      file: file,
      fileSize: fileSize,
      setUploadSectionOpen: uSectionOpen,
    });
    this.context.api.getMyFiles().then(console.log);
  };

  onUploadButtonClicked = (e) => {
    let api = this.context.api;
    if (this.state.file === null) return;
    api
      .uploadFile(this.state.file, (p) => {
        this.onProgress(p.loaded / p.total);
      })
      .then((res) => {
        this.onProgress(1);
      });
  };

  onProgress = (pct) => {
    // p.loaded / p.total
    console.log(pct);
  };

  render() {
    return (
      <div id="FileBox">
        <input
          type="file"
          accept=".txt"
          id="file-input"
          onChange={this.onFileButtonClicked}
        />
        {this.state.setUploadSectionOpen ? (
          <div id="upload-section">
            <button id="upload-button" onClick={this.onUploadButtonClicked}>
              Upload
            </button>
            <label id="size-label">{this.state.fileSize}</label>
          </div>
        ) : null}
      </div>
    );
  }
}

export default FileBox;
