
import { Router } from 'express';
import { login } from '../controllers/user.controller';
import asyncHandler from '../middleware/asyncHandler';
import { requireAdmin } from '../middleware/auth';
const router = Router();

// router.get('/admin-test', authenticateToken, requireAdmin, (req, res) => {
//   res.json({ message: 'Admin access granted' });
// });


router.post('/login', asyncHandler(login));

export default router;