import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './MessageItem.css'
import {configGet} from '../../common/config'

export class MessageItem extends Component {
    // get style of message box depending on whose information is it
    getStyle = (id) => {
        if (this.props.message.senderId === this.props.myUserId)
        {
            return { 
                fontSize: String(16 * configGet('fontSizeMultiplier')) + "px",
                background: '#262626',
                color: configGet('textColorUser'),
                marginLeft: '60%',
                marginRight: '1%',
                float: 'right'
            }
        }
        else {
            return {
                fontSize: String(16 * configGet('fontSizeMultiplier')) + "px",
                background: '#696969',
                color: configGet('textColorMain'),
                marginLeft: '1%',
            }
        }
    }

    // rendering div of single message box
    render() {
        const {senderName, senderId, sentAt, content, id} = this.props.message;
         return (
            <div>
                <div className='textbox' style={this.getStyle(id)}>
                    <p>{senderName} - &#9202; {new Date(Date.parse(sentAt)).toLocaleTimeString()}</p>
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
