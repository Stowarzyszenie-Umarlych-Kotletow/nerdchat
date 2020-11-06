import LatestMessage from './latestMessage';
import './LeftSideLatest.css';

function createLatestMessages(){
    let latestMessages = [];
    for(let i = 0; i < 12; i++) {
        let lMessage = new LatestMessage("John", "Hi, I'm John", "2.11.2020");
        latestMessages[i] = lMessage;
    }
    return latestMessages;
}

function getAllMessages() {
    let latMessages = createLatestMessages();
    let allMessages = [];
    for(let i = 0; i < latMessages.length; i++) {
        let item;
        item = <div id="latestMessage">
                    <div id="latestMessageName">{latMessages[i].name}</div>
                    <div id="latestMessageDate">{latMessages[i].date}</div>
                    <div id="latestMessageMessage">{latMessages[i].message}</div>  
                </div>
        allMessages.push(item);
    }
    return(allMessages)
}

function LeftSideLatest() {
    let msg = getAllMessages();
    return ([msg]);
}

export default LeftSideLatest;