import { Component } from "react";
import { UserContext } from "../context";
import "./FileBox.css";

class FileBox extends Component {
  state = {
    setUploadSectionOpen: false,
    fileSize: 0,
    file: undefined,
    fileUploadPct: 0,
    lastFiveFiles: [],
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
  };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.context.api.getMyFiles().then((res) => {
      //console.log(res);
      this.setState({ lastFiveFiles: res });
    });
  }

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
    this.componentDidUpdate();
  };

  handleSendClick = (id) => {
    this.props.send(id);
  };

  onProgress = (pct) => {
    // console.log(pct);
    this.setState({ fileUploadPct: pct });
  };

  getFormattedFileSize = () => {
    let size = this.state.fileSize;
    let sufix = "";
    if (size > 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      return (size / 1024).toFixed(2) + "KB";
    }
  };

  render() {
    return (
      <div id="FileBox">
        {this.state.lastFiveFiles.map((res) => (
          <div id="fileItem">
            <div id="fileName">{res.name}</div>
            <button
              id="sendFileButton"
              onClick={() => this.handleSendClick(res.id)}
            >
              Send
            </button>
          </div>
        ))}
        <input type="file" id="fileInput" onChange={this.onFileButtonClicked} />
        {this.state.setUploadSectionOpen ? (
          <div id="uploadSection">
            <button id="uploadButton" onClick={this.onUploadButtonClicked}>
              Upload
            </button>
            <label id="sizeLabel">{this.getFormattedFileSize()}</label>
            <div id="uploadProgressBarBox">
              <div
                id="uploadProgressBar"
                style={{
                  width: String(100 * this.state.fileUploadPct) + "%",
                  backgroundColor: "green",
                }}
              ></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default FileBox;
