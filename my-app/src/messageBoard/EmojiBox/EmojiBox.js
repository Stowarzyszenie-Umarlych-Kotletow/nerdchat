import React, { Component } from 'react'
import './EmojiBox.css'
import Emojis from './Emojis'

export class EmojiBox extends Component {
    state = {
        emojis: [
        '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', 
        '😍', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤔', '😐', '😑', '😶',
        '🙄'
        ]
    }

    render() {
        return (
            <div id="EmojiBox">
                <div id="EmojiBoxHeaderContainer">
                    <div id="EmojiBoxHeader" > Emoji Box</div>
                    <div className="XButton" onClick={() => {document.getElementById("EmojiBox").style.visibility = 'hidden';}}/>
                </ div>
                <div style={{padding: '15px'}}>
                   <Emojis emojis={this.state.emojis} />
                </div>
            </div>
        )   
    }


    componentDidMount(){
        this.dragElement(document.getElementById("EmojiBox"))
    }
    
   

    dragElement = (element) => {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        document.getElementById(element.id + "Header").onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function between(x, min_v, max_v) {
            x = Math.min(x, max_v);
            x = Math.max(x, min_v);
            return x;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            var emojiBox = document.getElementById("EmojiBox");
            const widthConstraint = visualViewport.width - emojiBox.offsetWidth;
            const heightConstraint = visualViewport.height - emojiBox.offsetHeight;
            // set the element's new position:
            element.style.top = between(element.offsetTop - pos2, 0, heightConstraint) + "px";
            element.style.left = between(element.offsetLeft - pos1, 0, widthConstraint) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }

    }
}



export default EmojiBox
