const xlsx = require('xlsx');
const path = require('path');

const filePath = 'C:/Users/navde/Downloads/complete batch 2024 3rd sem.xls';
const workbook = xlsx.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(`\nSheet: ${sheetName}`);
    console.log('First 5 rows:');
    console.log(data.slice(0, 5));
});
