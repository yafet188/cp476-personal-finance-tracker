const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'fail', msg: 'Please provide name, email, and password' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            status: 'ok',
            token: generateToken(result.insertId),
            data: { id: result.insertId, name, email }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ status: 'fail', msg: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', msg: 'Please provide email and password' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ status: 'fail', msg: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'fail', msg: 'Invalid credentials' });
        }

        res.status(200).json({
            status: 'ok',
            token: generateToken(user.id),
            data: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ status: 'fail', msg: 'Server error during login' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
    res.status(200).json({ success: true });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
        res.status(200).json({ success: true, data: users[0] });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};
