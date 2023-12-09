const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'failure',
        message: 'Password and password confirmation do not match',
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'harrysecret', { expiresIn: '1h' });
    const cookieOptions = {
      expires : new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
      )
    }

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      message: `Error occurred: ${error}`,
    });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          status: 'failure',
          message: 'Invalid email or password',
        });
      }
      
      const isPasswordMatch = await user.comparePassword(password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({
          status: 'failure',
          message: 'Invalid email or password',
        });
      }
  
      const token = jwt.sign({ userId: user._id }, 'harrysecret', { expiresIn: '1h' });
      const cookieOptions = {
        expires : new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        )
    }
  
      res.cookie('jwt', token, cookieOptions);
      user.password = undefined;
  
      res.status(200).json({
        status: 'success',
        token,
      });
    } catch (error) {
      res.status(500).json({
        status: 'failure',
        message: `Error occurred: ${error}`,
      });
    }
  };

module.exports = {
  signup,
  login
};
