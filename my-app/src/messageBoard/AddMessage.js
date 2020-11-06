import React, { Component } from 'react'

export class AddMessage extends Component {
    state = {
        content: ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.addMessage(this.state.content);
        this.setState({content: ''});
        document.getElementById('textField').focus();
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{display: 'flex'}}>
                <input 
                id = "textField"
                type="text" 
                name="content" 
                style={{flex: '10', padding: '5px'}}
                placeholder="Add Message..."
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
