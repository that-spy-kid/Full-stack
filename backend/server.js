const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 4000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'avnadmin',
  host: 'admin-db-mypersonaldata-3b79.l.aivencloud.com',
  database: 'defaultdb',
  password: 'AVNS_ljrr_22I3DL1mQ5WrYg',
  port: 16835,
  ssl: {
    rejectUnauthorized: false // Change to true if you have a trusted certificate
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// GET - List all credit cards
app.get('/api/credit-cards', async (req, res) => {
  try {
    console.log('get Api called');
    const result = await pool.query('SELECT * FROM credit_cards WHERE deleted = false ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add a new credit card
app.post('/api/credit-cards', async (req, res) => {
    const { name, bank, enabled } = req.body;
    try {
        console.log('post Api called');
      // Find the smallest ID where deleted = true
    //   const idResult = await pool.query(
    //     'SELECT id FROM credit_cards WHERE deleted = true ORDER BY id LIMIT 1'
    //   );
      
      let id;
    //   if (idResult.rows.length > 0) {
    //     id = idResult.rows[0].id;
    //     // Mark it as not deleted
    //     await pool.query('UPDATE credit_cards SET deleted = false WHERE id = $1', [id]);
    //   } else {
    //     // Get the next ID from the sequence
    //     id = await pool.query('SELECT nextval(\'credit_card_id_seq\') AS id');
    //     id = id.rows[0].id;
    //   }
      id = await pool.query('SELECT nextval(\'credit_card_id_seq\') AS id');
      id = id.rows[0].id;

      console.log(id);
  
      const result = await pool.query(
        'INSERT INTO credit_cards (id, name, bank, enabled) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, name, bank, enabled]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// PATCH - Update a credit card
app.patch('/api/credit-cards/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bank, enabled } = req.body;
  try {
    console.log('patch Api called');

    const result = await pool.query(
      'UPDATE credit_cards SET name = $1, bank = $2, enabled = $3 WHERE id = $4 RETURNING *',
      [name, bank, enabled, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Credit card not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a credit card
app.delete('/api/credit-cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log('delete Api called');

      const result = await pool.query(
        'UPDATE credit_cards SET deleted = true WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Credit card not found' });
      } else {
        res.status(200).json({ message: 'Credit card marked as deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
