import React, { Component } from 'react'

export class AddMessage extends Component {
    state = {
        content: ''
    }

    // function that submits a message
    onSubmit = (e) => {
        // overwriting onSubmit fuction
        e.preventDefault();
        // calling function that adds a message
        this.props.addMessage(this.state.content, "Me");
        // reseting input field
        this.setState({content: ''});
        // keeping a focus on input field to allow continious writing
        document.getElementById('textField').focus();
    }

    // function that handles changes in input field value
    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    // rendering two input elements, one text field and second a submit button
    render() {
        return (
            <form onSubmit={this.onSubmit} style={{display: 'flex'}}>
                <input 
                id = "textField"
                type="text" 
                name="content" 
                style={{flex: '10', padding: '5px', height: '40px'}}
                placeholder="Write a message..."
                value={this.state.content}
                onChange={this.onChange} 
                />
                <input 
                type="submit"
                value="Send"
                className="btn"
                style={{flex: '1'}}
                />
            </form>
        )
    }
}

export default AddMessage
