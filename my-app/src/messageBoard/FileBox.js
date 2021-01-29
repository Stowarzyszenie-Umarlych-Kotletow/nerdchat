import { Component } from "react";
import { UserContext } from "../context";
import "./FileBox.css";
import { getFormattedFileSize } from "../common/utils";

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

  getFiles() {
    this.context.api.getMyFiles().then((res) => {
      this.setState({ lastFiveFiles: res });
    });
  }

  componentDidMount() {
    this.getFiles();
  }

  componentDidUpdate() {}

  onUploadButtonClicked = (e) => {
    let api = this.context.api;
    if (this.state.file === null) return;
    api
      .uploadFile(this.state.file, (p) => {
        this.onProgress(p.loaded / p.total);
      })
      .then((res) => {
        this.onProgress(1);
        this.getFiles();
      });
  };

  handleSendClick = (id) => {
    this.props.send(id);
  };

  onProgress = (pct) => {
    this.setState({ fileUploadPct: pct });
  };

  render() {
    return (
      <div id="FileBox">
        {this.state.lastFiveFiles.map((res) => (
          <div class="fileItem">
            <div class="fileName">{res.name}</div>
            <button
              class="sendFileButton"
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
            <label id="sizeLabel">
              {getFormattedFileSize(this.state.fileSize)}
            </label>
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
