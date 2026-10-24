import { Router } from 'express';
import { createLeave, listLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.get('/', listLeave);
router.post('/', createLeave);
router.patch('/:id/status', allowRoles('Admin', 'HR'), updateLeaveStatus);
export default router;
