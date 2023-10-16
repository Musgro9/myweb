const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'messages.db');
const db = new sqlite3.Database(dbPath);

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)');
});

app.get('/', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY id', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while retrieving messages');
    } else {
      res.render('index', { messages: rows });
    }
  });
});

app.post('/', (req, res) => {
  const message = req.body.message;
  const stmt = db.prepare('INSERT INTO messages (content) VALUES (?)');
  stmt.run(message, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while saving the message');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
