const puppeteer = require('puppeteer');
const path = require('path');

/**
 * Can be modified to scrape all links from an URL with puppeteer
 */
async function getLinks() {
	return [
		'https://docs.github.com/en/get-started/quickstart/hello-world',
		'https://docs.github.com/en/get-started/quickstart/set-up-git',
	];
}

async function generatePdf(link, fileName, index) {
	const pdfPath = path.join(__dirname, './export', `${index}. ${fileName}.pdf`);

	const pdfOptions = {
		path: pdfPath,
		format: 'A4',
		margin: {
			top: '10mm',
			right: '10mm',
			bottom: '10mm',
			left: '10mm',
		},
	};

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: 'networkidle0' });
	await page.pdf(pdfOptions);
	await browser.close();

	console.log(`Generated PDF: ${pdfPath}`);
}

/**
 * Convert all HTML files to PDFs
 */
(async function convertToPdf() {
	const browser = await puppeteer.launch({ headless: "new" });
	const links = await getLinks();
	console.log(`Found ${links.length} links`);
	let index = 1;


	for (const link of links) {
		const fileName = path.basename(link);

		// Skip the TOC files
		if (!fileName.startsWith('#')) {
			await generatePdf(link, fileName, index);
			index++;
		}
	}

	await browser.close();
}());
