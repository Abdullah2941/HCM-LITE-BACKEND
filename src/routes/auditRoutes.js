import { Router } from 'express';
import { listAudit } from '../controllers/auditController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', requireAuth, allowRoles('Admin', 'HR'), listAudit);
export default router;
