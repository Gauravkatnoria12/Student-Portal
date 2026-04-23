const xlsx = require('xlsx');
const { initDb, db } = require('./database');
const path = require('path');

const filePath = 'C:/Users/navde/Downloads/complete batch 2024 3rd sem.xls';

const seed = async () => {
    await initDb();

    const workbook = xlsx.readFile(filePath);
    
    // 1. Import Students from "complete BLANK"
    const studentSheet = workbook.Sheets['complete BLANK'];
    const studentData = xlsx.utils.sheet_to_json(studentSheet);

    console.log(`Found ${studentData.length} students in 'complete BLANK'`);

    // Add Admin user
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
        ['admin2024', 'admin2024', 'admin']);

    studentData.forEach(row => {
        const rollNo = row['Roll No.'] || row['Roll No'];
        if (!rollNo) return;

        const name = row['Name'];
        const fatherName = row["Father's Name"];
        const motherName = row["Mother's Name"];
        const mobile = row['Mobile No.'] || row['Mobile No'];
        const regNo = row['Regd. No'] || row['Regd. No.'];
        const dob = row['Date of Birth'];
        const gender = row['Gender (M/F)'];
        const category = row['Reserve Category (yes/ no)'] || row['Caste'];
        const religion = row['Religian'];

        // Insert Student
        db.run(`INSERT OR REPLACE INTO students (roll_no, name, father_name, mother_name, mobile, reg_no, dob, gender, category, religion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [rollNo, name, fatherName, motherName, mobile, regNo, dob, gender, category, religion]);

        // Insert User (for student login)
        db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
            [rollNo, 'student123', 'student']);

        // Insert Fees
        db.run(`INSERT OR REPLACE INTO fees (roll_no, sem1, sem2, sem3, sem4, category)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [rollNo, row['1st'], row['2nd'], row['3rd'], row['4th'], category]);
    });

    // 2. Import Attendance from "Shortage" sheet if available
    const shortageSheet = workbook.Sheets['Shortage'];
    if (shortageSheet) {
        const attendanceData = xlsx.utils.sheet_to_json(shortageSheet, { range: 2 }); // Start from row 3
        attendanceData.forEach(row => {
            const rollNo = row['Roll No.'];
            if (!rollNo) return;

            const attended = row['Lecture Attended '];
            const percentage = row['%age'];

            db.run(`INSERT OR REPLACE INTO attendance (roll_no, total_lectures, attended_lectures, percentage)
                VALUES (?, ?, ?, ?)`,
                [rollNo, 503, attended === 'NSO' ? 0 : attended, percentage === 'NSO' ? 0 : percentage]);
        });
    }

    console.log('Seeding completed.');
};

seed().catch(err => console.error(err));
