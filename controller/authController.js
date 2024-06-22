const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const blacklist = new Set();

const register = async (req, res) => {
    const { username, password, email} = req.body;

    try {
        const existingEmail = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        const existingUsername = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingEmail[0] && existingEmail[0].length > 0 ) {
            console.log(existingEmail.length)
        return res.status(400).json({ error: `${email} is already registered`});
        }

        if (existingUsername[0] && existingUsername[0].length > 0 ) {
            console.log(existingUsername.length)
        return res.status(400).json({ error: `${email} is already registered`});
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const [ register ] = await pool.query(`
                INSERT INTO users (username, password, email)
                VALUES (?, ?, ?)
            `, [username, hashedPassword, email]);

        if (register.affectedRows === 1) {
            res.status(201).json({ message: 'User registered successfully'});
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }
        
        const validPassword = await bcrypt.compare(password, user[0]?.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }
    
        const token = jwt.sign({ userId: user[0].id}, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.header('Authorization', token).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const logout = (req, res) => {
    const token = req.token; // Token extracted by authMiddleware

    if (token) {
        blacklist.add(token);
        return res.status(200).json({ message: 'Logout successful' });
    }

    res.status(200).json({ message: 'Logout successful' });
}

module.exports = {
    register,
    login,
    logout,
    blacklist
}
