import './LeftSideContent.css';
import LatestMessage from './latestMessage'
import { render } from 'react-dom';
import React from 'react';
import LeftSideTitle from './LeftSideTitle';
import LeftSideLatest from './LeftSideLatest';


function LeftSide() {
    return (
        <React.Fragment>
            <div className="leftSideContainer">
                <LeftSideTitle />
                <LeftSideLatest />
            </div>
        </React.Fragment>
    )
    
}
export default LeftSide;