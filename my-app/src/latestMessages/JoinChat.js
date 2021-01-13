import React, { Component,  setState } from 'react'
import { UserConfig } from "../context";
import "./JoinChat.css"

class JoinChat extends Component{
    state = {
        chatCode: "",
        friend: ""
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });


    onSubmitChatCode = (e) => 
    {
        this.setState({ chatCode: "" });
        // join new Chat
        document.getElementById("joinChatBox").style.visibility = "hidden";

    }

    onSubmitFriend = (e) => 
    {
        this.setState({ friend: "" });
        // join new 1to1 chat with friend
        document.getElementById("joinChatBox").style.visibility = "hidden";

    }

    //✎
    render() {
    return (
        <div>
             <div id="joinChatBox">
             <div className="XButton" onClick={() => document.getElementById("joinChatBox").style.visibility = "hidden"} />
                <label> Enter Chat Code Here </label>
                <input
                    class="joinChatField"
                    type="text"
                    name="chatCode"
                    value={this.state.chatCode}
                    placeholder="E. g. lion-lasagne-ford"
                    onChange={this.onChange}
                />
                <input
                    class="joinChatButton"
                    type="button"
                    value="Join Chat!"
                    onClick={this.onSubmitChatCode}
                />
                <br />
                <br />
                <label> Enter Your Friends Nickname Here </label>

                <input
                    class="joinChatField"
                    type="text"
                    name="friend"
                    value={this.state.friend}
                    placeholder="E. g. miko3412"
                    onChange={this.onChange}
                />
                <input
                    class="joinChatButton"
                    type="button"
                    value="Chat With Friend!"
                    onClick={this.onSubmitFriend}
                />
            </div>
        </div> 
    );
    }
};

export default JoinChat;
