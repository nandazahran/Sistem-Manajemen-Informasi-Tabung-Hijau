const fs = require("fs");
const path = require("path");

function processDir(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			processDir(fullPath);
		} else if (fullPath.endsWith(".jsx") || fullPath.endsWith(".js")) {
			const content = fs.readFileSync(fullPath, "utf8");
			const newContent = content.replace(
				/<button(?![^>]*\btype=)/g,
				'<button type="button"',
			);
			if (content !== newContent) {
				fs.writeFileSync(fullPath, newContent);
				console.log("Fixed buttons in", fullPath);
			}
		}
	}
}

processDir("src");
console.log("Done fixing buttons.");
