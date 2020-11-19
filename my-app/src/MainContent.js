import LeftSide from './latestMessages/LeftSideContent';
import MessagesContent from './latestMessages/MessagesContent';
import LoginWindow from './loginWindow/loginWindow'

function Main() {
    return (
        <div>
            <LoginWindow />
            <div id="MainContent" style={{visibility: "hidden"}}>
                <MessagesContent /> 
                <LeftSide />
            </div>
        </div>
    )
}

export default Main