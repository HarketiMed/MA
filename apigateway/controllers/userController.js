const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    // Register new user
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Create user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                role: 'USER'
            });

            // Save to database
            const savedUser = await user.save();
            
            // Generate JWT
            const token = jwt.sign(
                { 
                    userId: savedUser._id,
                    email: savedUser.email,
                    role: savedUser.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Return response without password
            const userResponse = savedUser.toObject();
            delete userResponse.password;

            res.status(201).json({
                token,
                user: userResponse
            });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    // User login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email,
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Return response without password
            const userResponse = user.toObject();
            delete userResponse.password;

            res.json({
                token,
                user: userResponse
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Login failed' });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            console.error('Get profile error:', err);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }
}

module.exports = UserController;