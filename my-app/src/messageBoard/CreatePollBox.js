import React, { Component } from 'react'
import { UserConfig } from "../context";
import "./CreatePollBox.css"

export class CreatePollBox extends Component {
    static contextType = UserConfig;
    state = {
        pollName: "",
        pollOptions: ["", ""],
        errorMessage: ""
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onChangeOption = (e) => {
        let tempOptions = [...this.state.pollOptions];
        tempOptions[Number(e.target.name)] = e.target.value;
        this.setState({pollOptions: [...tempOptions]});
    }
    
    createOption = () => this.setState({pollOptions: [...this.state.pollOptions, ""]})

    createPoll = (e) => {
    if (this.state.pollName === "") {
        this.setState({errorMessage: "Poll name cannot be empty"});
        return;
    }

    this.props.switchOpenCreatePoll();
    }

    render() {
        return (
        <div>
            <div id="CreatePollBox" style={{color:this.context.textColorUser}}>
                <div
                    className="XButton"
                    onClick={() => this.props.switchOpenCreatePoll()}
                />
                <label> Poll Name </label>
                <input
                    type="hidden"
                    autoComplete="false"
                    style={{ width: "0px", height: "0px" }}
                 />
                <input
                    id="pollNameInputField"
                    type="text"
                    name="pollName"
                    placeholder="Write a message..."
                    value={this.state.pollName}
                    onChange={this.onChange}
                />
                <div id="pollOptionsBox">
                {(
                this.state.pollOptions.map((pollOption, id)=>(
                <div>
                    <label> Option {id} Name</label>
                    <input
                        class="pollOptionNameInputField"
                        type="text"
                        name={id}
                        placeholder="Write a message..."
                        value={pollOption}
                        onChange={this.onChangeOption}
                    />
                </div>)
                ))
                }
                </div>
                <div style={{display:"flex", flexDirection:"row", minWidth:"100%", justifyContent: "space-between", bottom: "0"}}>
                    <input
                        type="submit"
                        value="Add new Option"
                        className="pollButton"
                        onClick={this.createOption}
                        style={{color:this.context.textColorUser, fontWeight: "bold"}}
                    />
                    <input
                        type="submit"
                        value="Create a poll"
                        className="pollButton"
                        onClick={this.createPoll}
                        style={{color:this.context.textColorUser, fontWeight: "bold"}}
                    />
                </div>
                {this.state.errorMessage === ""? null : <label style={{color: "red", textAlign: "center"}}>{this.state.errorMessage}</label>}
            </div>
        </div>
        )
    }
}

export default CreatePollBox
