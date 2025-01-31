const User = require('./model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, username, email) => {
    return jwt.sign({ id, username, email }, process.env.JWT_Secret, { expiresIn: '1h' });
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const result = {
        status: 0,
        message: "User successfully registered",
        data: {}
    };

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            result.message = "User already exists";
            return res.status(400).json(result);
        }

        const userCount = await User.countDocuments();
        const userId = userCount + 1;

        const user = await User.create({
            username,
            email,
            password,
            user_id: userId
        });

        const resp_data = {
            _id: user._id,
            user_id: userId,
            username: user.username,
            email: user.email,
            token: generateToken(user._id, user.username, user.email)
        };

        result.data = resp_data;
        result.status = 1;
        res.status(200).json(result);

    } catch (error) {
        result.message = error.message;
        res.status(500).json(result);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const result = {
        status: 0,
        message: "User successfully logged in",
        data: {}
    };

    try {
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const resp_data = {
                _id: user._id,
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id, user.username, user.email)
            };

            result.data = resp_data;
            result.status = 1; 
            res.status(200).json(result);
        } else {
            result.message = "Invalid email or password";
            res.status(401).json(result);
        }
    } catch (error) {
        result.message = error.message;
        res.status(500).json(result);
    }
};

module.exports = { signup, login };
