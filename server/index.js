const express = require('express');
const cors = require('cors');
const { User, Student, Attendance, Fees, initDb } = require('./database');
require('dotenv').config();

const app = express();

// Allow requests from both local and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Students (Admin)
app.get('/api/students', (req, res) => {
  try {
    const students = Student.find();
    const studentsWithAttendance = students.map(student => {
      const attendance = Attendance.findOne({ roll_no: student.roll_no });
      return {
        ...student,
        percentage: attendance ? attendance.percentage : null,
        attended_lectures: attendance ? attendance.attended_lectures : null
      };
    });
    res.json(studentsWithAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Student Detail
app.get('/api/students/:rollNo', (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  try {
    const student = Student.findOne({ roll_no: rollNo });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const attendance = Attendance.findOne({ roll_no: rollNo });
    const fees = Fees.findOne({ roll_no: rollNo });

    const result = {
      ...student,
      percentage: attendance ? attendance.percentage : null,
      attended_lectures: attendance ? attendance.attended_lectures : null,
      total_lectures: attendance ? attendance.total_lectures : null,
      sem1: fees ? fees.sem1 : null,
      sem2: fees ? fees.sem2 : null,
      sem3: fees ? fees.sem3 : null,
      sem4: fees ? fees.sem4 : null
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Stats for Dashboard
app.get('/api/stats', (req, res) => {
  try {
    const totalStudents = Student.countDocuments();
    const attendances = Attendance.find();
    const averageAttendance = attendances.length > 0
      ? attendances.reduce((sum, a) => sum + (a.percentage || 0), 0) / attendances.length
      : 0;

    const categoryDistribution = Student.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalStudents,
      averageAttendance,
      categoryDistribution: categoryDistribution.map(c => ({ category: c._id, count: c.count }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add New Student (Admin)
app.post('/api/students', (req, res) => {
  const s = req.body;
  try {
    const existing = Student.findOne({ roll_no: s.roll_no });
    if (existing) return res.status(400).json({ error: "Roll Number already exists" });

    Student.create({
      roll_no: s.roll_no,
      name: s.name,
      father_name: s.father_name,
      mother_name: s.mother_name,
      mobile: s.mobile,
      reg_no: s.reg_no,
      dob: s.dob,
      gender: s.gender,
      category: s.category,
      religion: s.religion
    });

    User.create({ username: s.roll_no, password: 'student123', role: 'student' });
    Attendance.create({ roll_no: s.roll_no, total_lectures: 0, attended_lectures: 0, percentage: 0 });
    Fees.create({ roll_no: s.roll_no, sem1: 'Pending', sem2: 'Pending', sem3: 'Pending', sem4: 'Pending', category: s.category });

    res.json({ message: "Student added successfully", roll_no: s.roll_no });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Student (Admin)
app.put('/api/students/:rollNo', (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  const updates = req.body;
  try {
    const result = Student.updateOne({ roll_no: rollNo }, updates);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Student (Admin)
app.delete('/api/students/:rollNo', (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  try {
    Fees.deleteOne({ roll_no: rollNo });
    Attendance.deleteOne({ roll_no: rollNo });
    User.deleteOne({ username: rollNo });
    const result = Student.deleteOne({ roll_no: rollNo });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

try {
  initDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

module.exports = app;
