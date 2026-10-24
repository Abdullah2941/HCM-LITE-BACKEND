import { Router } from 'express';
import { listAttendance, checkIn, checkOut, createAttendance } from '../controllers/attendanceController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);router.get('/',listAttendance);router.post('/check-in',checkIn);router.post('/check-out',checkOut);router.post('/',allowRoles('Admin','HR'),createAttendance);export default router;
