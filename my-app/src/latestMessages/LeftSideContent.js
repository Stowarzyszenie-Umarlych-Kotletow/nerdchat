import './LeftSideContent.css';
import React from 'react';
import LeftSideTitle from './LeftSideTitle';
import LeftSideLatest from './LeftSideLatest';
import '../common/scrollbar.css'


function LeftSide() {
    return (
        <React.Fragment>
            <div className="leftSideContainer" >
                <LeftSideTitle />
                <div className="latestMessagesContainer">
                    <LeftSideLatest />
                </div>
            </div>
        </React.Fragment>
    )
    
}
export default LeftSide;