import { Router } from 'express';
import { loginForm, login, logout } from '../controllers/authController.js';
const router = Router();
router.get('/login', loginForm);
router.post('/login', login);
router.post('/logout', logout);
export default router;
