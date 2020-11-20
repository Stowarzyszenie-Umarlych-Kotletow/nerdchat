import './MessagesContent.css';
import MessageBoard from './../messageBoard/MessageBoard'
import {ChatContext} from '../App'

function MessagesContent() {
    return (
        <div id="messagesContent">
            <ChatContext.Consumer>
                {({activeChatId, myUserId})=> {
                    return <MessageBoard {...{activeChatId, myUserId}} />
                }}
            </ChatContext.Consumer>
            
        </div>
    )
}

export default MessagesContent;