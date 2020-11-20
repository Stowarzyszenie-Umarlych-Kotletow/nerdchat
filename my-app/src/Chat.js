import "./Chat.css";
import MessagesContent from "./latestMessages/MessagesContent";
import LeftSide from "./latestMessages/LeftSideContent";

const Chat = (props) => {

    return (
    <div id="MainContent" style={{visibility: "hidden"}}>
        <MessagesContent /> 
        <LeftSide/>
    </div>
    );
}

export default Chat;