import React, { Component,  setState } from 'react'
import { UserConfig } from "../context";
import "./JoinConversation.css"

class JoinConversation extends Component{
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => 
    {
        // join new conversation
        document.getElementById("joinConversationBox").style.visibility = "hidden";

    }

    //✎
    render() {
    return (
        <div>
             <div id="joinConversationBox">
             <div className="XButton" onClick={() => document.getElementById("joinConversationBox").style.visibility = "hidden"} />
                Enter Chat Code here
                <input
                    id="joinConversationField"
                    type="text"
                    name="chatcode"
                    placeholder="E. g. lion-lasagne-ford"
                    onChange={this.onChange}
                />
                <input
                    type="button"
                    value="Join Chat!"
                    id="joinConversationButton"
                    onClick={this.onSubmit}
                />
            </div>
        </div> 
    );
    }
};

export default JoinConversation;
