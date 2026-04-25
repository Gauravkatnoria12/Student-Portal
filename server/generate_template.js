const xlsx = require('xlsx');
const path = require('path');

const wb = xlsx.utils.book_new();

const firstNames = ["Aarav", "Ishani", "Rohan", "Sanya", "Vihaan", "Ananya", "Arjun", "Myra", "Sai", "Prisha", "Krishna", "Kavya", "Aryan", "Diya", "Vivaan", "Advika", "Reyansh", "Zoya", "Ayaan", "Siya", "Ishaan", "Riya", "Shaurya", "Anvi", "Atharv", "Kyra", "Viraj", "Navya", "Aditya", "Amara"];
const lastNames = ["Sharma", "Gupta", "Verma", "Singh", "Kumar", "Patel", "Yadav", "Das", "Gupta", "Mishra", "Joshi", "Kulkarni", "Iyer", "Nair", "Reddy", "Choudhury"];
const religions = ["Hindu", "Muslim", "Sikh", "Christian"];
const categories = ["GEN", "OBC", "SC", "ST"];

const generateData = () => {
    const students = [];
    const attendance = [{}, {}]; // Empty rows for header spacing

    for (let i = 1; i <= 70; i++) {
        const rollNo = `${700 + i}/24`;
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${fName} ${lName}`;
        
        const fatherName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lName}`;
        const motherName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lName}`;

        students.push({
            "Roll No.": rollNo,
            "Name": fullName,
            "Father's Name": "Mr. " + fatherName,
            "Mother's Name": "Mrs. " + motherName,
            "Mobile No.": "9" + Math.floor(100000000 + Math.random() * 900000000),
            "Regd. No": "RB24" + (1000 + i),
            "Date of Birth": "2002-05-" + (i % 28 + 1).toString().padStart(2, '0'),
            "Gender (M/F)": Math.random() > 0.5 ? "M" : "F",
            "Caste": categories[Math.floor(Math.random() * categories.length)],
            "Religian": religions[Math.floor(Math.random() * religions.length)],
            "1st": "Paid",
            "2nd": i % 5 === 0 ? "Pending" : "Paid",
            "3rd": "Pending",
            "4th": "Pending"
        });

        const attended = Math.floor(350 + Math.random() * 150);
        attendance.push({
            "Roll No.": rollNo,
            "Lecture Attended ": attended,
            "%age": ((attended / 503) * 100).toFixed(2)
        });
    }
    return { students, attendance };
};

const data = generateData();

const ws1 = xlsx.utils.json_to_sheet(data.students);
xlsx.utils.book_append_sheet(wb, ws1, "complete BLANK");

const ws2 = xlsx.utils.json_to_sheet(data.attendance);
xlsx.utils.book_append_sheet(wb, ws2, "Shortage");

const filePath = path.join(__dirname, 'student_template.xlsx');
xlsx.writeFile(wb, filePath);

console.log('✅ 70 students generated at:', filePath);
