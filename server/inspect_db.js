const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);
tables.forEach(t => {
  const count = db.prepare('SELECT COUNT(*) as c FROM ' + t.name).get();
  console.log(t.name + ':', count.c, 'rows');
  if (count.c > 0) {
    const sample = db.prepare('SELECT * FROM ' + t.name + ' LIMIT 2').all();
    console.log('Sample:', JSON.stringify(sample, null, 2));
  }
});
db.close();
