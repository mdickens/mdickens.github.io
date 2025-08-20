const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 800 });
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    // Start a new game to make the main layout visible
    await page.click('#start-game-button');
    await page.waitForSelector('#main-layout', { visible: true });

    await page.screenshot({ path: 'layout-before-fix.png' });

    await browser.close();
})();
