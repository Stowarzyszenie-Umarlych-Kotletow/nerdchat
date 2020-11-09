import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './MessageItem.css'

export class MessageItem extends Component {
    // get style of message box depending on whose information is it
    getStyle = (id) => {
        if (this.props.message.sender === 'Me')
        {
            return { 
                background: '#262626',
                color: '#f5f5f5',
                order: String() + id,
                marginLeft: '60%',
                marginRight: '1%',
                float: 'right'
            }
        }
        else {
            return {
                background: '#696969',
                color: '#1f1f2e',
                order: String() + id,
                marginLeft: '1%',
            }
        }
    }

    // rendering div of single message box
    render() {
        const {sender, time, content, id} = this.props.message;
         return (
            <div style={{}}>
                <div className='textbox' style={this.getStyle(id)}>
                    <p>{sender} - &#9202; {time}</p>
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
