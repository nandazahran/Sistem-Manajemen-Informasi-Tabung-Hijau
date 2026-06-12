const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`NETWORK ERROR: ${response.status()} ${response.url()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`UNCAUGHT ERROR: ${error.message}`);
  });

  page.on('dialog', async dialog => {
    console.log(`DIALOG: ${dialog.message()}`);
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    
    // Fill login
    await page.fill('input[type="email"]', 'tes');
    await page.fill('input[type="password"]', 'tes123');
    await page.evaluate(() => {
      document.querySelector('form').noValidate = true;
    });
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log("Current URL:", page.url());
    console.log("Page HTML:", await page.evaluate(() => document.body.innerHTML));
    
    // Take a screenshot to see if it's white
    await page.screenshot({ path: 'test_crash.png' });
    
  } catch (err) {
    console.error("Test Script Error:", err);
  } finally {
    await browser.close();
  }
})();
