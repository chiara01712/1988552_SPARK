const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()) RETURNING *',
        [username, email, hashedPassword, role]
    );
    res.json(result.rows[0]);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user.rows[0] || !(await bcrypt.compare(password, user.rows[0].password_hash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET);
    res.json({ token });
});

app.listen(5001, () => console.log('User Service running on port 5001'));
