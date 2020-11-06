import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class MessageItem extends Component {
    getStyle = () => {
       return {
            background: this.props.message.sender === 'Me' ? '#262626': '#b3b3b3',
            padding: '10px',
            textDecoration: 'none',
            color: this.props.message.sender === 'Me' ? '#f5f5f5' : '#1f1f2e',
            textAlign:  this.props.message.sender === 'Me' ? 'right': 'left'
        }
    }

    render() {
        const {sender, time, content} = this.props.message;
        return (
            <div style={this.getStyle()}>
                <p>{sender} - {time}</p>
                <h1>{content}</h1>
            </div>
        )
    }
}

// PropTypes
MessageItem.propTypes = {
    message: PropTypes.object.isRequired
}

export default MessageItem
