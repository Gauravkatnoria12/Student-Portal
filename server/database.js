const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables if they don't exist
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      roll_no TEXT PRIMARY KEY,
      name TEXT,
      father_name TEXT,
      mother_name TEXT,
      address TEXT,
      mobile TEXT,
      email TEXT,
      gender TEXT,
      dob TEXT,
      reg_no TEXT,
      category TEXT,
      religion TEXT,
      caste TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      roll_no TEXT PRIMARY KEY,
      total_lectures INTEGER,
      attended_lectures INTEGER,
      percentage REAL
    );

    CREATE TABLE IF NOT EXISTS fees (
      roll_no TEXT PRIMARY KEY,
      sem1 TEXT,
      sem2 TEXT,
      sem3 TEXT,
      sem4 TEXT,
      category TEXT
    );
  `);

  // Insert default admin user if not exists
  const admin = db.prepare("SELECT id FROM users WHERE username = 'admin2024'").get();
  if (!admin) {
    db.prepare("INSERT INTO users (username, password, role) VALUES ('admin2024', 'admin2024', 'admin')").run();
    console.log('Admin user created');
  }

  console.log('Connected to SQLite database');
};

// ---- User Operations ----
const User = {
  findOne: ({ username, password } = {}) => {
    if (password !== undefined) {
      return db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    }
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },
  create: ({ username, password, role }) => {
    db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)').run(username, password, role);
  },
  deleteOne: ({ username }) => {
    db.prepare('DELETE FROM users WHERE username = ?').run(username);
  }
};

// ---- Student Operations ----
const Student = {
  find: () => db.prepare('SELECT * FROM students ORDER BY roll_no').all(),
  findOne: ({ roll_no }) => db.prepare('SELECT * FROM students WHERE roll_no = ?').get(roll_no),
  countDocuments: () => db.prepare('SELECT COUNT(*) as c FROM students').get().c,
  create: (data) => {
    db.prepare(`
      INSERT INTO students (roll_no, name, father_name, mother_name, mobile, reg_no, dob, gender, category, religion)
      VALUES (@roll_no, @name, @father_name, @mother_name, @mobile, @reg_no, @dob, @gender, @category, @religion)
    `).run(data);
  },
  updateOne: ({ roll_no }, updates) => {
    const allowed = ['name', 'father_name', 'mother_name', 'mobile', 'reg_no', 'dob', 'gender', 'category', 'religion', 'address', 'email', 'caste'];
    const fields = Object.keys(updates).filter(k => allowed.includes(k));
    if (fields.length === 0) return { matchedCount: 0 };
    const setClause = fields.map(f => `${f} = @${f}`).join(', ');
    const stmt = db.prepare(`UPDATE students SET ${setClause} WHERE roll_no = @roll_no`);
    const result = stmt.run({ ...updates, roll_no });
    return { matchedCount: result.changes };
  },
  deleteOne: ({ roll_no }) => {
    const result = db.prepare('DELETE FROM students WHERE roll_no = ?').run(roll_no);
    return { deletedCount: result.changes };
  },
  aggregate: (pipeline) => {
    // Support simple $group by category
    const groupStage = pipeline.find(p => p.$group);
    if (groupStage && groupStage.$group._id === '$category') {
      return db.prepare('SELECT category as _id, COUNT(*) as count FROM students GROUP BY category').all()
        .map(r => ({ _id: r._id, count: r.count }));
    }
    return [];
  }
};

// ---- Attendance Operations ----
const Attendance = {
  find: () => db.prepare('SELECT * FROM attendance').all(),
  findOne: ({ roll_no }) => db.prepare('SELECT * FROM attendance WHERE roll_no = ?').get(roll_no),
  create: (data) => {
    db.prepare(`
      INSERT OR IGNORE INTO attendance (roll_no, total_lectures, attended_lectures, percentage)
      VALUES (@roll_no, @total_lectures, @attended_lectures, @percentage)
    `).run(data);
  },
  deleteOne: ({ roll_no }) => {
    db.prepare('DELETE FROM attendance WHERE roll_no = ?').run(roll_no);
  }
};

// ---- Fees Operations ----
const Fees = {
  findOne: ({ roll_no }) => db.prepare('SELECT * FROM fees WHERE roll_no = ?').get(roll_no),
  create: (data) => {
    db.prepare(`
      INSERT OR IGNORE INTO fees (roll_no, sem1, sem2, sem3, sem4, category)
      VALUES (@roll_no, @sem1, @sem2, @sem3, @sem4, @category)
    `).run(data);
  },
  deleteOne: ({ roll_no }) => {
    db.prepare('DELETE FROM fees WHERE roll_no = ?').run(roll_no);
  }
};

module.exports = { User, Student, Attendance, Fees, initDb };
