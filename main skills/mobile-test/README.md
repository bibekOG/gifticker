# Mobile E2E Testing Module

This folder contains the foundation for mobile E2E testing within the ECC ecosystem.

## Getting Started

To use this setup, you need to install the following dependencies based on your choice of framework.

### 1. Detox Setup (Recommended for React Native)

```bash
# Install Detox CLI
npm install -g detox-cli

# Install dependencies in your project
npm install detox @types/detox jest-detox --save-dev

# Initialize Detox
detox init -r jest
```

**Requirements:**
- macOS (for iOS testing)
- Xcode + Command Line Tools
- Android Studio + SDK (for Android testing)
- `applesimutils` (for iOS): `brew tap wix/brew && brew install applesimutils`

### 2. Appium Setup

```bash
# Install Appium
npm install -g appium

# Install Appium Drivers
appium driver install uiautomator2
appium driver install xcuitest

# Install Client (WebdriverIO)
npm install @wdio/cli --save-dev
```

## Running Tests

### Detox
```bash
# Build the app for testing
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug
```

### Appium
```bash
npx wdio run wdio.conf.js
```

## Agentic Workflow
You can use the `mobile-e2e-runner` agent to:
- Generate new test cases from user stories.
- Debug failing tests by analyzing logs and screenshots.
- Optimize test execution speed.
