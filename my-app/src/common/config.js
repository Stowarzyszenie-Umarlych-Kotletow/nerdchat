export class config {
    constructor(user_id) {
        this.config = {}
        this.user_id = user_id
        this.setDefaultValues();
        this.loadConfig();
        this.toLocalStorage();
        document.getElementsByTagName("body")[0].style.backgroundColor = localStorage.getItem('colorBackground');
    }        

    // loading form database
    loadConfig = () => {

    }
    
    // sending changes to database
    updateConfig = () => {

    }

    // loading default config
    setDefaultValues = () => {
        this.config = {
            // text
            fontSizeMultiplier: 1,
            textColorMain: '#1f1f2e', // 1f1f2e - 696969
            textColorUser: '#f5f5f5', //f5f5f5
            // background colors
            colorAccents: '#6f9', // 66ff99 - ffc933  - ff99cc 
            colorBackground: '#333', // 333333
            // time
            twelweHourFormating: false,
        }
    }

    // loading config to localStorage
    toLocalStorage = () => {
        for (var key in this.config) {
            localStorage.setItem(key, this.config[key]);
        }
    }


}

export default config
