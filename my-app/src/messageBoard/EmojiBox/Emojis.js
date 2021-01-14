import { Component } from 'react'


class Emojis extends Component {

    onClickEmoji = (e) =>
    {
        document.getElementById("textField").value += e;
        document.getElementById('textField').focus();
    }

    render() {
        // creating emoji button for every emoji
        return this.props.emojis.map((emoji) => (
            <input 
            type="button"
            value={emoji}
            id="EmojiButton"
            style={{flex: '1', fontSize: '30px', backgroundColor: '#4440', border:"none"}}
            onClick={()=>this.onClickEmoji(emoji)}
            /> 
        ));
    }
}

export default Emojis
