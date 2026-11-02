/**
 * Appium 2.x Desired Capabilities Configuration
 * College Hub Mobile Frontend (React Native - Android & iOS)
 */
const path = require('path');

const APPIUM_HOST = process.env.APPIUM_HOST || '127.0.0.1';
const APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723', 10);

const androidCaps = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
  'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '14.0',
  'appium:appPackage': 'com.collegeapp',
  'appium:appActivity': 'com.collegeapp.MainActivity',
  'appium:app': process.env.APP_PATH || path.resolve(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
  'appium:autoGrantPermissions': true,
  'appium:newCommandTimeout': 300,
  'appium:noReset': false,
  'appium:fullReset': false,
  'appium:skipServerInstallation': false,
  'appium:uiautomator2ServerInstallTimeout': 60000,
};

const iosCaps = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 15 Pro',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17.2',
  'appium:bundleId': 'org.reactjs.native.example.CollegeApp',
  'appium:app': process.env.IOS_APP_PATH || path.resolve(__dirname, '../../ios/build/Build/Products/Debug-iphonesimulator/CollegeApp.app'),
  'appium:autoAcceptAlerts': true,
  'appium:newCommandTimeout': 300,
  'appium:noReset': false,
  'appium:fullReset': false,
};

module.exports = {
  server: {
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    path: '/',
  },
  androidCaps,
  iosCaps,
  getActiveCaps: (platform = process.env.PLATFORM || 'android') => {
    return platform.toLowerCase() === 'ios' ? iosCaps : androidCaps;
  },
};

