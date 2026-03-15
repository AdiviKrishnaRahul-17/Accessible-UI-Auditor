document.addEventListener("DOMContentLoaded", () => {

const scanBtn = document.getElementById("scanBtn");
const downloadBtn = document.getElementById("downloadBtn");
const htmlInput = document.getElementById("htmlInput");
const report = document.getElementById("report");
const score = document.getElementById("score");
const issueCount = document.getElementById("issueCount");
const criticalCount = document.getElementById("criticalCount");

let auditResults = [];

scanBtn.addEventListener("click", runScan);

async function runScan() {

let html = htmlInput.value.trim();

if (!html) {
alert("Please paste HTML code first.");
return;
}

let container = document.createElement("div");
container.innerHTML = html;

document.body.appendChild(container);

try {

let results = await axe.run(container);

auditResults = results.violations;

displayResults(auditResults);

} catch (error) {

console.error("Accessibility scan failed:", error);
report.innerHTML = "<p style='color:red'>Error running accessibility scan</p>";

}

document.body.removeChild(container);

}

function displayResults(issues) {

let reportHTML = "";
let critical = 0;

issues.forEach(issue => {

let impact = issue.impact || "moderate";

if (impact === "critical") {
critical++;
}

reportHTML += `
<div class="issue ${impact}">
<h3>${issue.help}</h3>
<p><strong>Severity:</strong> ${impact}</p>
<p>${issue.description}</p>
<a href="${issue.helpUrl}" target="_blank">Fix Guide</a>
</div>
`;

});

let calculatedScore = Math.max(100 - issues.length * 5, 0);

score.innerText = calculatedScore;
issueCount.innerText = issues.length;
criticalCount.innerText = critical;

if (reportHTML === "") {
reportHTML = "<p style='color:green'>No accessibility issues detected.</p>";
}

report.innerHTML = reportHTML;

}

downloadBtn.addEventListener("click", () => {

if (auditResults.length === 0) {
alert("Run the scan first.");
return;
}

let data = JSON.stringify(auditResults, null, 2);

let blob = new Blob([data], { type: "application/json" });

let link = document.createElement("a");

link.href = URL.createObjectURL(blob);
link.download = "accessibility_report.json";

link.click();

});

});