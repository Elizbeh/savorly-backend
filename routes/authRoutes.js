
import express from 'express';
import pool from '../config/db.js';
import { getUserData, registerUser, resendVerificationEmail, refreshToken, logoutUser} from '../controllers/authController.js';
import { verifyEmail } from '../controllers/verifyEmailController.js';
import { loginUser } from '../controllers/loginController.js';
import { validateRegister, validateLogin } from '../middleware/validateInput.js';
import { authenticate } from '../middleware/authenticate.js';
import rateLimit from 'express-rate-limit';
import { isAdmin } from '../middleware/isAdmin.js';


const router = express.Router();

const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many attempts from this IP, pls try again after 15 minutes.',
});

// Registration Route with validation middleware
router.post('/register', registerRateLimiter, validateRegister, registerUser);

// Email verification route
router.get('/verify-email', verifyEmail);


// Set up rate lmiting:5 request per IP address
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many attempts from this IP, pls try again after 15 minutes.',
});

// Login Route with validation middleware
router.post('/login', loginRateLimiter, validateLogin, loginUser);

// protected route using authentication middleware
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You are authorized!', user: req.user });
});


// Route for resending a verification email with a new token
router.post("/resend-verification", async (req, res) => {
    const { email } = req.body;
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (!users.length) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const user = users[0];
    
  
    // Generate a new token and send the email
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    // Send email with new token
    resendVerificationEmail(user.email, newToken);
  
    res.status(200).json({ message: 'Verification email resent successfully.' });
  });
  // Get the user data (authenticated)
router.get('/user', authenticate, getUserData);
  
  router.post('/refresh-token', refreshToken);
  
  router.post('/logout', logoutUser);

export default router;
