import LeftSide from './latestMessages/LeftSideContent';
import MessagesContent from './latestMessages/MessagesContent';
import LoginWindow from './loginWindow/loginWindow'
import './MainContent.css'

function Main() {
    return (
        <div>
            <LoginWindow />
            <div id="MainContent">
                <MessagesContent /> 
                <LeftSide />
            </div>
        </div>
    )
}

export default Main