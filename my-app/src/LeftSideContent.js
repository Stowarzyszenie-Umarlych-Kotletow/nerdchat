import './LeftSideContent.css';
import LatestMessage from './latestMessage'

function createLatestMessages(){
    let latestMessages = [];
    for(let i = 0; i < 10; i++) {
        let lMessage = new LatestMessage("John", "Hi, I'm John", "2.11.2020");
        latestMessages[i] = lMessage;
    }
    return latestMessages;
}

function LeftSide() {
    let latMessages = createLatestMessages();
    let allMessages = [];
    for(let i = -1; i < latMessages.length; i++) {
        let item;
        if(i === -1){
            item = <div id="menuLeftContent"><h2>Latest messages</h2></div>
        }
        else {
        item = <div id="latestMessage">
            <p>{latMessages[i].name} | {latMessages[i].message} | {latMessages[i].date}
            </p></div>
        }
        allMessages.push(item)
    }
    return(allMessages)
}
export default LeftSide;