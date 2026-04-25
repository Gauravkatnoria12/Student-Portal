const Database = require('better-sqlite3');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const sqlitePath = path.join(__dirname, 'database.sqlite');
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

// ─── MongoDB Schemas ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({ username: { type: String, unique: true }, password: { type: String }, role: String });
const studentSchema = new mongoose.Schema({ roll_no: { type: String, unique: true }, name: String, father_name: String, mother_name: String, mobile: String, reg_no: String, dob: String, gender: String, category: String, religion: String });
const attendanceSchema = new mongoose.Schema({ roll_no: { type: String, unique: true }, total_lectures: Number, attended_lectures: Number, percentage: Number });
const feesSchema = new mongoose.Schema({ roll_no: { type: String, unique: true }, sem1: String, sem2: String, sem3: String, sem4: String, category: String });

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Fees = mongoose.model('Fees', feesSchema);

async function migrate() {
  const db = new Database(sqlitePath);
  console.log('📖 Reading from SQLite...');

  const sqliteUsers = db.prepare('SELECT * FROM users').all();
  const sqliteStudents = db.prepare('SELECT * FROM students').all();
  const sqliteAttendance = db.prepare('SELECT * FROM attendance').all();
  const sqliteFees = db.prepare('SELECT * FROM fees').all();

  console.log(`📊 Found: ${sqliteUsers.length} Users, ${sqliteStudents.length} Students`);

  await mongoose.connect(mongoUri);
  console.log('🚀 Connected to MongoDB Atlas');

  // Clear existing (optional - uncomment if you want a clean start)
  // await User.deleteMany({});
  // await Student.deleteMany({});
  // await Attendance.deleteMany({});
  // await Fees.deleteMany({});

  console.log('⏳ Importing Users...');
  for (const u of sqliteUsers) {
    try { await User.create({ username: u.username, password: u.password, role: u.role }); } catch (e) {}
  }

  console.log('⏳ Importing Students...');
  for (const s of sqliteStudents) {
    try { await Student.create({ roll_no: s.roll_no, name: s.name, father_name: s.father_name, mother_name: s.mother_name, mobile: s.mobile, reg_no: s.reg_no, dob: s.dob, gender: s.gender, category: s.category, religion: s.religion }); } catch (e) {}
  }

  console.log('⏳ Importing Attendance...');
  for (const a of sqliteAttendance) {
    try { await Attendance.create({ roll_no: a.roll_no, total_lectures: a.total_lectures, attended_lectures: a.attended_lectures, percentage: a.percentage }); } catch (e) {}
  }

  console.log('⏳ Importing Fees...');
  for (const f of sqliteFees) {
    try { await Fees.create({ roll_no: f.roll_no, sem1: f.sem1, sem2: f.sem2, sem3: f.sem3, sem4: f.sem4, category: f.category }); } catch (e) {}
  }

  console.log('✅ Migration COMPLETE!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
