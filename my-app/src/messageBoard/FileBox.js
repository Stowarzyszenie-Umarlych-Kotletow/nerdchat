import { Component } from "react";
import { UserConfig } from "../context";
import "./FileBox.css";

class FileBox extends Component {
  state = {
    setUploadSectionOpen: false,
    fileSize: 0,
    file: undefined,
    currentUploadedBytes: 21,
  }

  static contextType = UserConfig;
  
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
    }else{
      uSectionOpen = false;
      fileSize = 0;
    }
    this.setState({
      file: file,
      fileSize: fileSize,
      setUploadSectionOpen: uSectionOpen,
    })
  };

  onUploadButtonClicked = (e) => {
    // console.log((100 * this.state.currentUploadedBytes) / this.state.fileSize);
    this.setState({currentUploadedBytes: Math.min(this.state.currentUploadedBytes + 100, this.state.fileSize)});
  }

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
              width: String((100 * this.state.currentUploadedBytes) / this.state.fileSize) + "%",
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
