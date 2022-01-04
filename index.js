const puppeteer = require('puppeteer');
const fs = require('fs');

const headless = true;
const defaultUrl = 'http://testphp.vulnweb.com/AJAX/';
const defaultOutput = 'output.json';
const defaultUnique = true;

(async () => {
	const results = [];
	var done = false;

	const browser = await puppeteer.launch({headless: headless});
	const page = await browser.newPage();
	const targetUrl = process.argv.length > 2
			? process.argv[2]
			: defaultUrl;
	const outputName = process.argv.length > 3
			? process.argv[3]
			: defaultOutput;
	const uniqueEntries = process.argv.length > 4
			? (process.argv[4] === 'true')
			: defaultUnique;

	await page.goto(targetUrl);

	page.on('request', request => {
		if (request.resourceType() === 'xhr') {
			const s = `${request.method()} ${request.url()}`;
			if (!uniqueEntries || results.indexOf(s) < 0) {
				results.push(s);
			};
			console.log(s);
		}
	});

	page.on('dialog', async dialog => {
		await dialog.dismiss();
	});

	page.on('console', async (msg) => {
		console.log(`${msg.type()}: ${msg.text()}`);
	});

	await page.exposeFunction('puppeteerDone', () => {
		done = true;
	})

	await page.evaluate(async () => {
		const queue = [];

		function clickNextAnchor() {
			if (queue.length > 0) {
				const list = queue[queue.length - 1];
				if (list.length > 0) {
					list.shift().click();
					setTimeout(clickNextAnchor, 2000);
				} else {
					queue.pop();
					setTimeout(clickNextAnchor, 0);
				}
			} else {
				puppeteerDone();
			}
		}

		function addAnchors(rootElement) {
			const aa = rootElement.getElementsByTagName('a');
			const list = [];
			for (var a of aa) {
				list.push(a);
			}
			queue.push(list);
		}

		(new MutationObserver((mutations) => {
			for (m of mutations) {
				m.addedNodes.forEach(e => {
					addAnchors(e);
				});
			}
		})).observe(document.body, {childList:true, subtree:true});

		// initial set of anchors
		addAnchors(document.body);
		// start
		clickNextAnchor();
	});

	while (!done) {
		await page.waitForTimeout(1000);
	}

	await browser.close();

	fs.writeFileSync(outputName, JSON.stringify(results));
})();
