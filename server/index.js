const express = require('express');
const cors = require('cors');
const { User, Student, Attendance, Fees, initDb } = require('./database');
require('dotenv').config();

const app = express();

// Allow any localhost port (dev) or the deployed FRONTEND_URL (prod)
// Allow ALL for setup (will restrict later)
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Emergency Admin Setup
app.get('/api/setup-admin', async (req, res) => {
  try {
    const { User } = require('./database');
    await User.deleteOne({ username: 'admin2024' });
    await User.create({ username: 'admin2024', password: 'admin2024', role: 'admin' });
    res.json({ message: 'Admin account READY! Login with admin2024 / admin2024' });
  } catch (err) {
    console.error('Setup Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Demo Data Setup (Visit this to see the app in action!)
app.get('/api/demo', async (req, res) => {
  try {
    const demoStudents = [
      { roll_no: '701/24', name: 'Gaurav Katnoria', category: 'GEN', gender: 'Male' },
      { roll_no: '702/24', name: 'Amit Singh', category: 'OBC', gender: 'Male' },
      { roll_no: '703/24', name: 'Priya Sharma', category: 'GEN', gender: 'Female' }
    ];

    for (const s of demoStudents) {
      const exists = await Student.findOne({ roll_no: s.roll_no });
      if (!exists) {
        await Student.create({ ...s, father_name: 'Father', mother_name: 'Mother', mobile: '1234567890' });
        await User.create({ username: s.roll_no, password: 'student123', role: 'student' });
        await Attendance.create({ roll_no: s.roll_no, total_lectures: 100, attended_lectures: 85, percentage: 85 });
        await Fees.create({ roll_no: s.roll_no, sem1: 'Paid', sem2: 'Pending', sem3: 'Pending', sem4: 'Pending', category: s.category });
      }
    }
    res.json({ message: 'Demo students added! Refresh your dashboard.' });
  } catch (err) {
    console.error('Demo Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get All Students (Admin) ─────────────────────────────────────────────────
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    const studentsWithAttendance = await Promise.all(students.map(async (student) => {
      const attendance = await Attendance.findOne({ roll_no: student.roll_no });
      return {
        ...student,
        percentage: attendance ? attendance.percentage : null,
        attended_lectures: attendance ? attendance.attended_lectures : null
      };
    }));
    res.json(studentsWithAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Single Student ───────────────────────────────────────────────────────
app.get('/api/students/:rollNo', async (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  try {
    const student = await Student.findOne({ roll_no: rollNo });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const attendance = await Attendance.findOne({ roll_no: rollNo });
    const fees = await Fees.findOne({ roll_no: rollNo });

    res.json({
      ...student,
      percentage: attendance ? attendance.percentage : null,
      attended_lectures: attendance ? attendance.attended_lectures : null,
      total_lectures: attendance ? attendance.total_lectures : null,
      sem1: fees ? fees.sem1 : null,
      sem2: fees ? fees.sem2 : null,
      sem3: fees ? fees.sem3 : null,
      sem4: fees ? fees.sem4 : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const attendances = await Attendance.find();
    const averageAttendance = attendances.length > 0
      ? attendances.reduce((sum, a) => sum + (a.percentage || 0), 0) / attendances.length
      : 0;

    const categoryDistribution = await Student.aggregate([
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

// ─── Add New Student ──────────────────────────────────────────────────────────
app.post('/api/students', async (req, res) => {
  const s = req.body;
  try {
    const existing = await Student.findOne({ roll_no: s.roll_no });
    if (existing) return res.status(400).json({ error: 'Roll Number already exists' });

    await Student.create({
      roll_no: s.roll_no, name: s.name,
      father_name: s.father_name, mother_name: s.mother_name,
      mobile: s.mobile, reg_no: s.reg_no,
      dob: s.dob, gender: s.gender,
      category: s.category, religion: s.religion
    });
    await User.create({ username: s.roll_no, password: 'student123', role: 'student' });
    await Attendance.create({ roll_no: s.roll_no, total_lectures: 0, attended_lectures: 0, percentage: 0 });
    await Fees.create({ roll_no: s.roll_no, sem1: 'Pending', sem2: 'Pending', sem3: 'Pending', sem4: 'Pending', category: s.category });

    res.json({ message: 'Student added successfully', roll_no: s.roll_no });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Update Student ───────────────────────────────────────────────────────────
app.put('/api/students/:rollNo', async (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  const updates = req.body;
  try {
    const result = await Student.updateOne({ roll_no: rollNo }, updates);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Delete Student ───────────────────────────────────────────────────────────
app.delete('/api/students/:rollNo', async (req, res) => {
  const rollNo = decodeURIComponent(req.params.rollNo);
  try {
    await Fees.deleteOne({ roll_no: rollNo });
    await Attendance.deleteOne({ roll_no: rollNo });
    await User.deleteOne({ username: rollNo });
    const result = await Student.deleteOne({ roll_no: rollNo });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();

module.exports = app;
