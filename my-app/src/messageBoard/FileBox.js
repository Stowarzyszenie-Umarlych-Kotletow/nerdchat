import { Component } from "react";
import { UserContext } from "../context";
import "./FileBox.css";

class FileBox extends Component {
  state = {
    setUploadSectionOpen: false,
    fileSize: 0,
    file: undefined,
    fileUploadPct: 0,
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
      fileSize = file.size.toFixed(2);
      reader.readAsBinaryString(file);
    } else {
      uSectionOpen = false;
      fileSize = 0;
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
    this.setState({fileUploadPct : pct});
  };

  render() {
    return (
      <div id="FileBox">
        <input
          type="file"
          accept=".txt"
          id="fileInput"
          onChange={this.onFileButtonClicked}
        />
        { this.state.setUploadSectionOpen ? 
        (
        <div id="uploadSection">
          <button id="uploadButton" onClick={this.onUploadButtonClicked}>Upload</button>
          <label id="sizeLabel">{String((this.state.fileSize/1024).toFixed(2)) + "KB"}</label>
          <div id="uploadProgressBarBox">
          <div 
            id="uploadProgressBar" 
            style={{
              width: String(this.state.fileUploadPct) + "%",
              backgroundColor: "green",
            }}>
          </div>
        </div>
        </div>) : null
        }
      </div>
    );
  }
}

export default FileBox;
