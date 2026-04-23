const express = require('express');
const cors = require('cors');
const { db } = require('./database');
require('dotenv').config();

const app = express();

// Allow requests from both local and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL // Will be set during deployment
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
        
        // In a real app, send a JWT. Here we send user info.
        res.json({
            id: row.id,
            username: row.username,
            role: row.role
        });
    });
});

// Get All Students (Admin)
app.get('/api/students', (req, res) => {
    const query = `
        SELECT s.*, a.percentage, a.attended_lectures 
        FROM students s
        LEFT JOIN attendance a ON s.roll_no = a.roll_no
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Single Student Detail
app.get('/api/students/:rollNo', (req, res) => {
    const { rollNo } = req.params;
    const query = `
        SELECT s.*, a.percentage, a.attended_lectures, a.total_lectures, f.sem1, f.sem2, f.sem3, f.sem4
        FROM students s
        LEFT JOIN attendance a ON s.roll_no = a.roll_no
        LEFT JOIN fees f ON s.roll_no = f.roll_no
        WHERE s.roll_no = ?
    `;
    db.get(query, [rollNo], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Student not found' });
        res.json(row);
    });
});

// Get Stats for Dashboard
app.get('/api/stats', (req, res) => {
    const stats = {};
    db.get(`SELECT COUNT(*) as total FROM students`, (err, row) => {
        stats.totalStudents = row.total;
        db.get(`SELECT AVG(percentage) as avgAttendance FROM attendance`, (err, row) => {
            stats.averageAttendance = row.avgAttendance || 0;
            db.all(`SELECT category, COUNT(*) as count FROM students GROUP BY category`, (err, rows) => {
                stats.categoryDistribution = rows;
                res.json(stats);
            });
        });
    });
});

// Add New Student (Admin)
app.post('/api/students', (req, res) => {
    const s = req.body;
    
    db.serialize(() => {
        // 1. Create Student record
        const studentQuery = `INSERT INTO students (roll_no, name, father_name, mother_name, mobile, reg_no, dob, gender, category, religion) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(studentQuery, [s.roll_no, s.name, s.father_name, s.mother_name, s.mobile, s.reg_no, s.dob, s.gender, s.category, s.religion], function(err) {
            if (err) return res.status(500).json({ error: "Roll Number already exists or database error" });

            // 2. Create User account for login
            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [s.roll_no, 'student123', 'student']);

            // 3. Initialize Attendance
            db.run(`INSERT INTO attendance (roll_no, total_lectures, attended_lectures, percentage) VALUES (?, ?, ?, ?)`, 
                [s.roll_no, 0, 0, 0]);

            // 4. Initialize Fees
            db.run(`INSERT INTO fees (roll_no, sem1, sem2, sem3, sem4, category) VALUES (?, ?, ?, ?, ?, ?)`,
                [s.roll_no, 'Pending', 'Pending', 'Pending', 'Pending', s.category]);

            res.json({ message: "Student added successfully", roll_no: s.roll_no });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
