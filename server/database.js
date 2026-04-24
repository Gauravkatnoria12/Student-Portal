const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table for auth
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            )`);

            // Students details
            db.run(`CREATE TABLE IF NOT EXISTS students (
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
            )`);

            // Attendance summary
            db.run(`CREATE TABLE IF NOT EXISTS attendance (
                roll_no TEXT PRIMARY KEY,
                total_lectures INTEGER,
                attended_lectures INTEGER,
                percentage REAL,
                FOREIGN KEY(roll_no) REFERENCES students(roll_no)
            )`);

            // Fees
            db.run(`CREATE TABLE IF NOT EXISTS fees (
                roll_no TEXT PRIMARY KEY,
                sem1 TEXT,
                sem2 TEXT,
                sem3 TEXT,
                sem4 TEXT,
                category TEXT,
                FOREIGN KEY(roll_no) REFERENCES students(roll_no)
            )`, (err) => {
                if (err) reject(err);
                else {
                    // Insert default admin user
                    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
                        ['admin2024', 'admin2024', 'admin'], (insertErr) => {
                        if (insertErr) console.error('Error inserting admin user:', insertErr);
                        resolve();
                    });
                }
            });
        });
    });
};

module.exports = { db, initDb };
