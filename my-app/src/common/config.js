export class config {
    config = { }

    setDefaultValues = () => {
        this.config = {
            // font
            fontSizeMultiplier: 1,
            // background colors
            colorsAccents: '#ffc933',
            colorsMessageBoardBackground: '#333333',
            colorTextUser: '#f5f5f5',
            colorMessageBoxUser: '#262626',
            colorTextOthers: '#1f1f2e',
            colorMessageBoxOthers: '#696969',
            colorConversationsBox: '#1f272b',

            // time
            twelweHourFormating: false
        }
    }
   
}

export default config
