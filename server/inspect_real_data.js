const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'complete batch 2024 3rd sem.xls');
const workbook = xlsx.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

const sheet = workbook.Sheets['complete BLANK'] || workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
console.log('Columns in complete BLANK:', Object.keys(data[0] || {}));
console.log('Sample Row in complete BLANK:', data[0]);

const shortageSheet = workbook.Sheets['Shortage'];
if (shortageSheet) {
    const attData = xlsx.utils.sheet_to_json(shortageSheet, { range: 2 });
    console.log('Sample Attendance Row:', attData[0]);
}
