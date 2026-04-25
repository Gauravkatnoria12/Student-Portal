const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'data.xls');
const workbook = xlsx.readFile(filePath);

// Check complete BLANK sheet
const studentSheet = workbook.Sheets['complete BLANK'];
const studentData = xlsx.utils.sheet_to_json(studentSheet);
console.log('=== STUDENT DATA ===');
console.log('Total rows:', studentData.length);
console.log('Columns:', Object.keys(studentData[0]));
console.log('First 3 rows:');
studentData.slice(0, 3).forEach((r, i) => console.log(`Row ${i}:`, JSON.stringify(r)));

// Check Shortage sheet  
const shortageSheet = workbook.Sheets['Shortage'];
const attData = xlsx.utils.sheet_to_json(shortageSheet, { range: 2 });
console.log('\n=== ATTENDANCE DATA ===');
console.log('Total rows:', attData.length);
console.log('Columns:', Object.keys(attData[0]));

// Find all unique non-numeric values in "Lecture Attended"
const nonNumeric = new Set();
attData.forEach(row => {
  const val = row['Lecture Attended '];
  if (val !== undefined && isNaN(Number(val))) {
    nonNumeric.add(val);
  }
});
console.log('Non-numeric attendance values:', [...nonNumeric]);

// Find all unique non-numeric values in "%age"
const nonNumericPct = new Set();
attData.forEach(row => {
  const val = row['%age'];
  if (val !== undefined && isNaN(Number(val))) {
    nonNumericPct.add(val);
  }
});
console.log('Non-numeric percentage values:', [...nonNumericPct]);

// Show a few problematic rows
console.log('\nSample problematic rows:');
attData.filter(r => isNaN(Number(r['Lecture Attended ']))).slice(0, 5).forEach(r => console.log(JSON.stringify(r)));
