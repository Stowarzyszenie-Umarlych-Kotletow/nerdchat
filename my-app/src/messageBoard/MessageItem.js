import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './MessageItem.css'

export class MessageItem extends Component {
    getStyle = (id) => {
        if (this.props.message.sender === 'Me')
        {
            return { 
                display: 'inline-block',
                background: '#262626',
                padding: '10px',
                textDecoration: 'none',
                color: '#f5f5f5',
                textAlign: 'right',
                maxWidth: '40%',
                wordWrap: "break-word",
                order: String() + id,
                marginBottom: '10px',
                marginRight: '1%',
                marginLeft: '60%',
                float: 'right'
            }
        }
        else {
            return {
                display: 'inline-block',
                background: '#696969',
                padding: '10px',
                textDecoration: 'none',
                color: '#1f1f2e',
                textAlign: 'left',
                maxWidth: '40%',
                marginLeft: '1%',
                wordWrap: "break-word",
                order: String() + id,
                marginBottom: '10px'
            }
        }
    }

    render() {
        const {sender, time, content, id} = this.props.message;
        return (
            <div style={{}}>
                <div className='textbox' style={this.getStyle(id)}>
                    <p>{sender} - {time}</p>
                    <h1>{content}</h1>
                </div>
            </div>
        )
    }
}

// PropTypes
MessageItem.propTypes = {
    message: PropTypes.object.isRequired
}

export default MessageItem
