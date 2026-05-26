---
name: mobile-e2e-testing
description: Detox and Appium mobile E2E testing patterns, Page Object Model for native apps, configuration, and artifact management.
---

# Mobile E2E Testing Patterns

Comprehensive patterns for building stable, fast, and maintainable mobile E2E test suites using Detox (preferred for React Native) and Appium.

## Detox Pattern (React Native)

Detox is a gray-box testing framework that provides high stability by monitoring the app's internal state.

### File Organization
```
e2e/
├── auth/
│   ├── login.test.js
│   └── logout.test.js
├── features/
│   └── onboarding.test.js
├── init.js
└── detox.config.js
```

### Test Structure
```javascript
describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await element(by.id('email_input')).typeText('test@example.com');
    await element(by.id('password_input')).typeText('password123');
    await element(by.id('login_button')).tap();

    await expect(element(by.text('Welcome Back!'))).toBeVisible();
  });
});
```

## Appium Pattern (Native/Cross-Platform)

Appium is a black-box testing framework that works across platform boundaries.

### Test Structure (WebdriverIO)
```javascript
describe('Native App Test', () => {
  it('should find element by accessibility id', async () => {
    const el = await $('~login_button');
    await el.click();
    
    const welcome = await $('~welcome_text');
    await expect(welcome).toBeDisplayed();
  });
});
```

## Page Object Model (POM) for Mobile

```javascript
class LoginPage {
  get emailInput() { return element(by.id('email_input')); }
  get passwordInput() { return element(by.id('password_input')); }
  get loginButton() { return element(by.id('login_button')); }

  async login(email, password) {
    await this.emailInput.typeText(email);
    await this.passwordInput.typeText(password);
    await this.loginButton.tap();
  }
}

module.exports = new LoginPage();
```

## Best Practices

- **Use `testID` (React Native)** or **Accessibility ID (Native)** for locators. Avoid XPath.
- **Isolate Tests**: Reset the app state before each test using `device.reloadReactNative()`.
- **Handle Permissions**: Use `device.launchApp({ permissions: { notifications: 'YES' } })`.
- **Mock External Services**: Use a mock server (like Mockintosh) for API calls to speed up tests.
- **Artifacts**: Always enable screenshots on failure and video recording for debugging.

## CI/CD Integration

Example GitHub Action step:
```yaml
- name: Run Detox Tests
  run: |
    applesimutils --list # Verify simulator
    detox test --configuration ios.sim.release --cleanup
```

---
*Refer to the `mobile-e2e-runner` agent for automated test execution and reporting.*
