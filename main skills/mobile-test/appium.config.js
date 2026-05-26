// Appium / WebdriverIO Configuration Boilerplate
exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    
    updateJob: false,
    specs: [
        './tests/specs/**/*.js'
    ],
    exclude: [],
    
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        'appium:app': '/path/to/app-debug.apk'
    }, {
        platformName: 'iOS',
        'appium:deviceName': 'iPhone Simulator',
        'appium:automationName': 'XCUITest',
        'appium:app': '/path/to/app-debug.app'
    }],

    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};
