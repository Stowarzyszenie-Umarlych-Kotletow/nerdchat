var userConfig = { }

// loading default config
export function configSetDefault () {
    window.userConfig = {
        // text
        'fontSizeMultiplier': 1,
        'textColorMain': '#1f1f2e', // 1f1f2e - 696969
        'textColorUser': '#f5f5f5', //f5f5f5
        // background colors
        'colorAccents': '#6f9', // 66ff99 - ffc933  - ff99cc 
        'colorBackground': '#333', // 333333
        // time
        'twelweHourFormating': false,
    }
}

export function configGet(key) {
    return window.userConfig[key];
}

// update config locally and send changes to database
export function configUpdate(key, value) {
    window.userConfig[key]=value; 
    console.log(window.userConfig);
}

// loading form database
export function configImport(userId) {
      // TODO load from database
}
    
// sending changes to database
export function configExport(userId) {
      // TODO send to database
}