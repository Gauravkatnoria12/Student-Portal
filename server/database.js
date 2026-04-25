const mongoose = require('mongoose');

// ─── Schemas ──────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String
});

const studentSchema = new mongoose.Schema({
  roll_no: { type: String, unique: true },
  name: String,
  father_name: String,
  mother_name: String,
  address: String,
  mobile: String,
  email: String,
  gender: String,
  dob: String,
  reg_no: String,
  category: String,
  religion: String,
  caste: String
});

const attendanceSchema = new mongoose.Schema({
  roll_no: { type: String, unique: true },
  total_lectures: Number,
  attended_lectures: Number,
  percentage: Number
});

const feesSchema = new mongoose.Schema({
  roll_no: { type: String, unique: true },
  sem1: String,
  sem2: String,
  sem3: String,
  sem4: String,
  category: String
});

// ─── Models ───────────────────────────────────────────────────────────────────

const UserModel = mongoose.model('User', userSchema);
const StudentModel = mongoose.model('Student', studentSchema);
const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
const FeesModel = mongoose.model('Fees', feesSchema);

// ─── DB Init ──────────────────────────────────────────────────────────────────

const initDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Please add it to your .env file.');
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  // Seed default admin if not present
  const admin = await UserModel.findOne({ username: 'admin2024' });
  if (!admin) {
    await UserModel.create({ username: 'admin2024', password: 'admin2024', role: 'admin' });
    console.log('👤 Admin user created (admin2024 / admin2024)');
  }
};

// ─── Abstraction Layer (same API as before) ────────────────────────────────────

const User = {
  findOne: (query) => UserModel.findOne(query).lean(),
  create: (data) => UserModel.create(data),
  deleteOne: (query) => UserModel.deleteOne(query),
};

const Student = {
  find: () => StudentModel.find().lean(),
  findOne: (query) => StudentModel.findOne(query).lean(),
  countDocuments: () => StudentModel.countDocuments(),
  create: (data) => StudentModel.create(data),
  updateOne: (query, updates) => StudentModel.updateOne(query, { $set: updates }),
  deleteOne: (query) => StudentModel.deleteOne(query),
  aggregate: (pipeline) => StudentModel.aggregate(pipeline),
};

const Attendance = {
  find: () => AttendanceModel.find().lean(),
  findOne: (query) => AttendanceModel.findOne(query).lean(),
  create: (data) => AttendanceModel.create(data),
  deleteOne: (query) => AttendanceModel.deleteOne(query),
};

const Fees = {
  findOne: (query) => FeesModel.findOne(query).lean(),
  create: (data) => FeesModel.create(data),
  deleteOne: (query) => FeesModel.deleteOne(query),
};

module.exports = { User, Student, Attendance, Fees, initDb };
