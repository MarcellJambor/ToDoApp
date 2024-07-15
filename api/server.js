import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';

const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const portdb= process.env.PORT;


const db = new pg.Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: portdb,
});

const app = express();
const port = 3000;

db.connect();


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, dbRes) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error executing query');
    } else {
      res.json(dbRes.rows);
    }
  });
});

app.post('/add', (req, res) => {
  const { task, done } = req.body;
  db.query('INSERT INTO tasks (task, done) VALUES ($1, $2)', [task, done], (err) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error executing query');
    } else {
      res.status(201).send('Task added successfully');
    }
  });
});

app.post('/toggle/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE tasks SET done = NOT done WHERE id = $1', [id], (err) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error executing query');
    } else {
      res.status(200).send('Task status toggled successfully');
    }
  });
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    db.query('DELETE FROM tasks WHERE id= $1', [id], (err) => {
        if (err) {
            console.error('Error executing query', err.stack);
            res.status(500).send('Error executing query');
          } else {
            res.status(200).send('Task status toggled successfully');
          }
    })
})

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    db.query('UPDATE tasks SET task = $1 WHERE id = $2', [task, id], (err) => {
      if (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error executing query');
      } else {
        res.status(200).send('Task updated successfully');
      }
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
